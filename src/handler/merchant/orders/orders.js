const {
  paymentTokenGenerate,
} = require("../../../utils/payment-token-generate/generate-payment-token");
const { StoreSchema, CreateOrderSchema } = require("../../../models/common");
const axios = require("axios");
const { PaymentLink } = require("../../../utils/translate/aurora-payment");

const { Json } = require("../../../utils/translate/merchant");

exports.getOrders = async (req) => {
  const { dburi } = req;
  const {
    page = 1,
    limit = 10,
    search = "",
    filter = "createdAt",
    filter_table = false,
  } = req.query;
  const { store_id, filterObject } = req.body;

  try {
    const Storeschema = dburi.model("stores", StoreSchema.schema);
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

    // Fetch store
    const checkStore = await Storeschema.findById(store_id);
    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.get_orders.resultCode,
        message: Json.orders.error.get_orders.message,
      };
    }

    const setDefaultPage = Number(page);
    const setDefaultPageLimit = Number(limit);
    const sortDirection =
      filter_table === "true" || filter_table === true ? 1 : -1;

    // Dynamic query object
    const query = {
      store_id: store_id,
      ...(filterObject?.start_date &&
        filterObject?.end_date && {
          order_date: {
            $gte: filterObject?.start_date,
            $lte: filterObject?.end_date,
          },
        }),
      ...(filterObject?.order_type && { order_type: filterObject?.order_type }),
      ...(filterObject?.pay_type && { pay_type: filterObject?.pay_type }),
      ...(filterObject?.order_status && {
        order_status: filterObject?.order_status,
      }),
      ...(filterObject?.delivery_type && {
        delivery_type: filterObject?.delivery_type,
      }),
      $or: [
        { order_id: { $regex: new RegExp(search, "i") } },
        { order_status: { $regex: new RegExp(search, "i") } },
        { order_date: { $regex: new RegExp(search, "i") } },
        { order_time: { $regex: new RegExp(search, "i") } },
        { order_type: { $regex: new RegExp(search, "i") } },
        { pay_type: { $regex: new RegExp(search, "i") } },
        { total_price: { $regex: new RegExp(search, "i") } },
      ],
    };

    // Fetch orders with pagination and sorting dynamically
    // Corrected aggregation pipeline
    const orders = await CreateOrderschema.aggregate([
      { $match: query },
      {
        $addFields: {
          total_price_as_number: { $toDouble: "$total_price" },
          order_date_time: {
            $cond: {
              if: {
                $or: [
                  { $eq: ["$order_date", null] },
                  { $eq: ["$createdAt", null] },
                ],
              },
              then: null,
              else: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: {
                            $convert: { input: "$order_date", to: "date" },
                          },
                        },
                      }, // Convert order_date to Date and format to string
                      " ",
                      {
                        $dateToString: {
                          format: "%H:%M:%S",
                          date: {
                            $convert: { input: "$createdAt", to: "date" },
                          },
                        },
                      }, // Convert createdAt to Date and format to string
                    ],
                  },
                  onError: null,
                  onNull: null,
                },
              },
            },
          },
        },
      },
      {
        $sort: {
          [filter === "total_price"
            ? "total_price_as_number"
            : filter === "order_date"
            ? "order_date_time"
            : filter]: sortDirection,
        },
      },
      { $skip: (setDefaultPage - 1) * setDefaultPageLimit },
      { $limit: setDefaultPageLimit },
      {
        $project: {
          total_price_as_number: 0,
          order_date_time: 0,
          __v: 0,
          updatedAt: 0,
          createdAt: 0,
        },
      },
    ]);

    // Return empty array if no orders are found
    if (orders.length === 0) {
      return {
        responseCode: 200,
        success: true,
        resultCode: Json.orders.success.get_orders.resultCode,
        message: "No orders found",
        data: [],
        currentPage: setDefaultPage,
        totalPages: 0,
        limit: setDefaultPageLimit,
        totalCount: 0,
        showingRow: "0 - 0",
      };
    }

    // Calculate total documents for pagination
    const totalDocuments = await CreateOrderschema.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);

    const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
    const endRow = startRow + orders.length - 1;

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.success.get_orders.resultCode,
      message: Json.orders.success.get_orders.message,
      data: orders,
      currentPage: setDefaultPage,
      totalPages,
      limit: setDefaultPageLimit,
      totalCount: totalDocuments,
      showingRow: `${startRow} - ${endRow}`,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.orders.error.get_orders.resultCode,
      message: Json.orders.error.get_orders.message,
      db_error: error.message,
    };
  }
};

exports.cancelPayment = async (req) => {
  const { dburi } = req;

  const { order_id } = req.body;

  try {
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

    const res = await CreateOrderschema.findById(order_id);

    if (!res) {
      return {
        responseCode: 500,
        resultCode: Json.cancel_orders.error.get_order.resultCode,
        message: Json.cancel_orders.error.get_order.message,
        success: false,
      };
    }

    const { tokenResponse } = await paymentTokenGenerate();

    if (
      res.pay_type === "Card" &&
      (res.order_status === "Accepted" ||
        res.order_status === "Cooking" ||
        res.order_status === "Paid" ||
        res.order_status === "Ready" ||
        res.order_status === "Completed")
    ) {
      const bodyData = {
        cardDataSource: 1,
        transactionId: res.transaction_id,
        amount: res.total_price,
      };

      const config = {
        method: "post",
        url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_refund}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        data: bodyData,
      };

      try {
        const { data } = await axios.request(config);

        await CreateOrderschema.findByIdAndUpdate(order_id, {
          payment_status: data.status,
          order_status: "Cancelled",
        });

        return {
          responseCode: 200,
          resultCode: Json.cancel_orders.success.get_order.resultCode,
          success: true,
          message: Json.cancel_orders.success.get_order.resultCode,
          data: data,
        };
      } catch (error) {
        return {
          responseCode: 500,
          success: true,
          resultCode: Json.cancel_orders.error.get_order.resultCode,
          message: Json.cancel_orders.error.get_order.message,
          data_error: error.response.data.Errors.Amount[0],
        };
      }
    } else if (res.pay_type === "Card" && res.order_status === "Pending") {
      const config = {
        method: "post",
        url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_payment_status_check}${res.transaction_status_id}/cancel`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      };

      const { data } = await axios.request(config);

      await CreateOrderschema.findByIdAndUpdate(order_id, {
        order_status: "Cancelled",
      });

      return {
        responseCode: 200,
        resultCode: Json.cancel_orders.success.get_order.resultCode,
        success: true,
        message: Json.cancel_orders.success.get_order.resultCode,
        data: data,
      };
    } else if (res.pay_type === "Cash" || res.pay_type === "Pay-Later") {
      await CreateOrderschema.findByIdAndUpdate(order_id, {
        order_status: "Cancelled",
      });

      return {
        responseCode: 200,
        resultCode: Json.cancel_orders.success.get_order.resultCode,
        success: true,
        message: Json.cancel_orders.success.get_order.resultCode,
      };
    }

    return {
      responseCode: 500,
      resultCode: Json.cancel_orders.error.get_order.resultCode,
      success: false,
      message: Json.cancel_orders.error.get_order.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.cancel_orders.error.get_order.resultCode,
      message: Json.cancel_orders.error.get_order.resultCode,
      success: false,
      message: error.message,
    };
  }
};

exports.completedOrder = async (req) => {
  const { dburi } = req;

  const { order_id } = req.body;

  try {
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

    const res = await CreateOrderschema.findById(order_id);

    if (!res) {
      return {
        responseCode: 500,
        resultCode: Json.complete_order.error.get_order.resultCode,
        message: Json.complete_order.error.get_order.message2,
        success: false,
      };
    }

    await CreateOrderschema.findByIdAndUpdate(order_id, {
      order_status: "Completed",
    });

    return {
      responseCode: 200,
      resultCode: Json.complete_order.success.get_order.resultCode,
      success: true,
      message: Json.complete_order.success.get_order.resultCode,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.complete_order.error.get_order.resultCode,
      message: Json.complete_order.error.get_order.resultCode,
      message: error.message,
    };
  }
};
