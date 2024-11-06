const {
  paymentTokenGenerate,
} = require("../../../utils/payment-token-generate/generate-payment-token");
const {
  CreateOrderSchema,
  ItemSchema,
  StoreSchema,
  DeviceSchema,
} = require("../../../models/common");

const { Json } = require("../../../utils/translate/pos");
const dayjs = require("dayjs");
const moment = require("moment");

const customParseFormat = require("dayjs/plugin/customParseFormat");
const { createPaymentIntent } = require("../aurora-payments/payment");
dayjs.extend(customParseFormat);

exports.createOrder = async (req) => {
  try {
    const { dburi, mac_address } = req;
    const {
      order_date,
      order_time,
      store_name,
      store_id,
      customer_name,
      discount,
      item_strike,
      order_data,
      order_type,
      pay_type,
      phone,
      tax,
      balance_amount,
      order_seconds,
      delivery_type,
      terminal_id,
    } = req.body;

    // Define schemas outside the function
    const Storeschema = dburi.model("stores", StoreSchema.schema);
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);
    const Itemschema = dburi.model("items", ItemSchema.schema);
    const Deviceschema = dburi.model("devices", DeviceSchema.schema);

    // Check for the device
    const findDevice = await Deviceschema.find({ mac_address, type: "POS" });

    // Check if store exists
    const store = await Storeschema.findById(store_id);
    if (!store) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.store.resultCode,
        message: Json.create_order.error.store.message,
      };
    }
    const openStoreTime = store.store_open_time;
    const closeStoreTime = store.store_close_time;

    const storeOpenTime = dayjs(openStoreTime, "HH:mm");
    let storeCloseTime = dayjs(closeStoreTime, "HH:mm");

    if (storeCloseTime.isBefore(storeOpenTime)) {
      storeCloseTime = storeCloseTime.add(1, "day");
    }

    // Parse the order time from the input
    let orderTime = dayjs(order_time, "hh:mm A");

    if (orderTime.isBefore(storeOpenTime)) {
      orderTime = orderTime.add(1, "day");
    }

    if (
      storeOpenTime.isValid() &&
      storeCloseTime.isValid() && // Ensure times are valid
      (orderTime.isBefore(storeOpenTime) || orderTime.isAfter(storeCloseTime))
    ) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.create.resultCode,
        message: Json.create_order.error.create.message3,
      };
    }

    // Extract item IDs and check if there are any
    const itemIds = order_data.map((itm) => itm.item_id).filter(Boolean);
    if (itemIds.length === 0) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.create.resultCode,
        message: Json.create_order.error.create.message,
      };
    }

    // Fetch item prices
    const prices = await Itemschema.find({
      store_id,
      _id: { $in: itemIds },
    }).select("_id item_price");
    const priceMap = prices.reduce((map, item) => {
      map[item._id] = item.item_price;
      return map;
    }, {});

    // Map item prices and validate
    const itemsWithPrices = order_data.map((itm) => {
      const price = priceMap[itm.item_id] || 0;
      return { ...itm, price };
    });

    const missingPrices = itemsWithPrices.filter((item) => item.price === 0);
    if (missingPrices.length > 0) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.items.resultCode,
        message: Json.create_order.error.items.message,
      };
    }

    // Calculate total price
    const totalPrice = itemsWithPrices.reduce(
      (total, item) => total + parseFloat(item.price),
      0
    );
    const date = dayjs(order_date).format("YYYY-MM-DD");
    const orderCount = await CreateOrderschema.countDocuments({
      store_id,
      order_date: date,
    });
    const orderId = `000${orderCount + 1}`
    const totalPriceWithTax = (totalPrice + parseFloat(tax)).toFixed(2);

    const bodyData = {
      order_date,
      order_time,
      store_name,
      store_id,
      customer_name: customer_name ? customer_name : "",
      discount,
      item_strike,
      order_data: itemsWithPrices,
      order_id: orderId,
      order_type,
      pay_type,
      delivery_type,
      phone: phone ? phone : "",
      sub_total: totalPrice.toFixed(2),
      tax: parseFloat(tax).toFixed(2),
      balance_amount: parseFloat(balance_amount).toFixed(2),
      total_price: totalPriceWithTax,
      order_seconds,
      position: orderCount,
      serial_no:
        findDevice.length > 0 && findDevice[0]?.connected
          ? findDevice[0]?.serial_no
          : "",
      order_status: pay_type === "Cash" ? "Paid" : "Pending",
    };

    // Handle payment based on payment type
    if (pay_type === "Cash") {
      const response = await CreateOrderschema.create(bodyData);
      return {
        responseCode: 200,
        success: true,
        resultCode: Json.create_order.success.create.resultCode,
        message: Json.create_order.success.create.message,
        data: {
          id: response._id,
          order_type: response.order_type,
          delivery_type: response.delivery_type,
          order_number: response.order_id,
        },
      };
    }

    if (pay_type === "Card") {
      const {
        tokenResponse,
        success: SUCCESS,
        message: error_msg,
      } = await paymentTokenGenerate(); // Fetch access token
      if (!SUCCESS) {
        return {
          responseCode: 500,
          resultCode: Json.create_order.error.create.resultCode,
          success: false,
          message: error_msg,
        };
      }

      const {
        success,
        data,
        message,
        responseCode,
        resultCode,
        referenceID,
        code,
      } = await createPaymentIntent({
        access_token: tokenResponse.access_token,
        payment: totalPriceWithTax,
        terminalId: terminal_id,
      });

      if (!success) {
        return {
          responseCode,
          resultCode,
          success,
          message,
          code,
        };
      }

      bodyData.payment_status = data.status;
      bodyData.transaction_status_id = data.posTransactionId;
      bodyData.payment_reference_id = referenceID;
      bodyData.payment_terminal_id = terminal_id;

      const createdOrder = await CreateOrderschema.create(bodyData);
      return {
        responseCode: 201,
        success: true,
        resultCode: Json.create_order.success.create.resultCode,
        message: Json.create_order.success.create.message,
        data: {
          transaction_id: data.posTransactionId,
          status: data.status,
          token: tokenResponse.access_token,
          order_id: createdOrder._id,
          order_type: createdOrder.order_type,
          delivery_type: createdOrder.delivery_type,
          order_number: createdOrder.order_id,
        },
      };
    }

    if (pay_type === "Pay-Later") {
      const response = await CreateOrderschema.create(bodyData);
      return {
        responseCode: 200,
        success: true,
        resultCode: Json.create_order.success.create.resultCode,
        message: Json.create_order.success.create.message,
        data: {
          id: response._id,
          order_type: response.order_type,
          delivery_type: response.delivery_type,
          order_number: response.order_id,
        },
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.create_order.error.create.resultCode,
      message: Json.create_order.error.create.message,
      db_error: error.message,
    };
  }
};

exports.getOrders = async (req) => {
  const {
    page = 1,
    limit = 10,
    search,
    filter = "createdAt",
    filter_table = false,
  } = req.query;
  const { store_id, merchant_id } = req.body;
  const { dburi } = req;

  try {
    const Storeschema = dburi.model("stores", StoreSchema.schema);
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

    // Fetch store
    const checkStore = await Storeschema.findById(store_id);
    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.create_order.error.get_orders.resultCode,
        message: Json.create_order.error.get_orders.message1,
      };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const setDefaultPage = Number(page);
    const setDefaultPageLimit = Number(limit);

    // Determine sort direction
    const sortDirection =
      filter_table === "true" || filter_table === true ? 1 : -1;

    // Execute aggregation
    const orders = await CreateOrderschema.find({
      store_id: store_id,
      createdAt: { $gte: sevenDaysAgo },
      $or: [
        // Match any of the following conditions
        { order_id: { $regex: new RegExp(search, "i") } },
        { order_status: { $regex: new RegExp(search, "i") } },
        { order_date: { $regex: new RegExp(search, "i") } },
        { order_time: { $regex: new RegExp(search, "i") } },
        { order_type: { $regex: new RegExp(search, "i") } },
        { pay_type: { $regex: new RegExp(search, "i") } },
        { total_price: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort({ [filter]: sortDirection }) // Apply sorting based on the filter
      .select("-__v -updatedAt -createdAt")
      .skip((setDefaultPage - 1) * setDefaultPageLimit)
      .limit(setDefaultPageLimit)
      .lean();

    // Calculate total documents for pagination
    const totalDocuments = await CreateOrderschema.countDocuments({
      store_id: store_id,
      createdAt: { $gte: sevenDaysAgo },
      $or: [
        // Match any of the following conditions
        { order_id: { $regex: new RegExp(search, "i") } },
        { order_status: { $regex: new RegExp(search, "i") } },
        { order_date: { $regex: new RegExp(search, "i") } },
        { order_type: { $regex: new RegExp(search, "i") } },
        { pay_type: { $regex: new RegExp(search, "i") } },
        { total_price: { $regex: new RegExp(search, "i") } },
      ],
    });
    const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);

    const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
    const endRow = startRow + orders.length - 1;

    // const data = orders

    // const OrderData = data.map((item) => {
    //   return {
    //     ...item,
    //     order_time: dayjs(item.order_time, ["hh:mm A", "hh:mm:ss A"]).format("hh:mm A"),
    //   }
    // })

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.create_order.success.get_orders.resultCode,
      message: Json.create_order.success.get_orders.message,
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
      resultCode: Json.create_order.error.get_orders.resultCode,
      message: Json.create_order.error.get_orders.message,
      db_error: error.message,
    };
  }
};

exports.updateOrderStatus = async (req) => {
  const { dburi } = req;
  const { order_id } = req.body;

  const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

  try {
    const find = await CreateOrderschema.findById(order_id);

    if (!find) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.create_order.error.update_order.resultCode,
        message: Json.create_order.error.update_order.message1,
      };
    }

    await CreateOrderschema.findByIdAndUpdate(find._id, {
      order_status: "Accepted",
    });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.create_order.success.update_order.resultCode,
      message: Json.create_order.success.update_order.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.create_order.error.update_order.resultCode,
      message: Json.create_order.error.update_order.message,
      db_error: error.message,
    };
  }
};

exports.getOrder = async (req) => {
  const { dburi } = req;
  const { store_id, order_id } = req.body;

  try {
    const Storeschema = await dburi.model("stores", StoreSchema.schema);
    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );

    const checkStore = await Storeschema.findById(store_id);

    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.create_order.error.get_orders.resultCode,
        message: Json.create_order.error.get_orders.message1,
      };
    }

    const orders = await CreateOrderschema.findById(order_id)
      .select("-__v -updatedAt -createdAt")
      .populate({
        path: "store_id",
        model: Storeschema,
      });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.create_order.success.get_order.resultCode,
      message: Json.create_order.success.get_order.message,
      data: orders,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.create_order.error.get_order.resultCode,
      message: Json.create_order.error.get_order.message,
      db_error: error.message,
    };
  }
};
