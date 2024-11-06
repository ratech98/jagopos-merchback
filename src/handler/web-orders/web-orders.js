const {
  StoreSchema,
  CategorySchema,
  ItemSchema,
  CreateOrderSchema,
} = require("../../models/common");

const MerchantSchema = require("../../models/merchant");

const { AdminconnectTenantDB } = require("../../config");

const { Json } = require("../../utils/translate/web-order");
const { paymentObject } = require("../../utils/autora-payment");
const {
  paymentTokenGenerate,
} = require("../../utils/payment-token-generate/generate-payment-token");

const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const generateRandom = require("short-unique-id");

const axios = require("axios");
const { PaymentLink } = require("../../utils/translate/aurora-payment");

exports.generateToken = async () => {
  const token = await jwt.sign(
    { anonymous: true },
    process.env._JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  return {
    responseCode: 201,
    success: true,
    resultCode: Json.generate_token.success.generateToken.resultCode,
    message: Json.generate_token.success.generateToken.message,
    token: token,
  };
};

exports.getstoreItems = async (req) => {
  const { merchant, store } = req.query;

  const merchantname = merchant;
  const formattedName = merchantname.replace(/-/g, " ");

  const storename = store;
  const formattedName1 = storename.replace(/-/g, " ");

  try {
    const Merchant = await MerchantSchema.findOne({
      merchant_name: formattedName,
    });

    const { dburi } = await AdminconnectTenantDB(Merchant._id);

    const Storeschema = dburi.model("stores", StoreSchema.schema);
    const Categoryschema = dburi.model("categories", CategorySchema.schema);
    const Itemsschema = dburi.model("items", ItemSchema.schema);

    const GetStore = await Storeschema.findOne({
      store_name: formattedName1,
    });

    if (!GetStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.getsoreItems.error.getItems.resultCode,
        message: Json.getsoreItems.error.getItems.message1,
      };
    }

    const GetCategory = await Categoryschema.find({
      store_id: GetStore._id,
      category_status: true,
    });

    // if (GetCategory.length === 0) {
    //   return {
    //     responseCode: 404,
    //     success: false,
    //     resultCode: Json.item.error.token_error.resultCode,
    //     message: Json.item.error.token_error.message2,
    //   };
    // }

    const GetItems = await Itemsschema.find({
      store_id: GetStore._id,
      item_available: true,
    });

    // Prepare category map
    let categoryMap = GetCategory.reduce((acc, item) => {
      acc[item._id] = {
        // store_id: item.store_id,
        category_id: item._id,
        category: item.category_name,
        items_data: [],
      };
      return acc;
    }, {});

    // Associate items with their categories
    GetItems.forEach((item) => {
      if (categoryMap[item.category_id]) {
        categoryMap[item.category_id].items_data.push({
          item_id: item._id,
          name: item.item_name,
          description: item.item_description,
          price: item.item_price,
          image: item.item_image,
          status: item.item_available,
          sub_item:
            item.subItem.length > 0
              ? item.subItem.map((sub) => ({
                  _id: sub?._id,
                  id: sub?.id,
                  name: sub?.name,
                  extra: false,
                  no: false,
                }))
              : item.subItem,
          notes: null,
        });
      }
    });

    const categoryList = GetCategory.map((item) => ({
      name: item.category_name,
      id: item._id,
    }));

    // Convert categoryMap to array
    const storeCategory = Object.values(categoryMap);

    const updateData = {
      all_categories: categoryList,
      all_items: storeCategory,
      store_details: GetStore,
    };

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.getsoreItems.success.getItems.resultCode,
      message: Json.getsoreItems.success.getItems.message,
      data: updateData,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.getsoreItems.error.getItems.resultCode,
      message: Json.getsoreItems.error.getItems.message,
      db_error: error.message,
    };
  }
};

exports.createOrder = async (req) => {
  try {
    const {
      merchant_name,
      order_date,
      order_time,
      store_name,
      store_id,
      customer_name,
      discount,
      item_strike,
      order_data,
      pay_type,
      phone,
      tax,
      balance_amount,
      order_seconds,
      tip,
      customer_email,
      billingAddress,
      accountNumber,
      securityCode,
      expirationMonth,
      expirationYear,
      ip_address,
    } = req.body;

    const { tokenResponse } = await paymentTokenGenerate();

    const merchantname = merchant_name;
    const formattedName = merchantname.replace(/-/g, " ");

    const storename = store_name;
    const formattedName1 = storename.replace(/-/g, " ");

    const Merchant = await MerchantSchema.findOne({
      merchant_name: formattedName,
    });

    if (!Merchant) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.merchant.resultCode,
        message: Json.create_order.error.merchant.message,
      };
    }

    const { dburi } = await AdminconnectTenantDB(Merchant._id);

    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );
    const Storechema = await dburi.model("stores", StoreSchema.schema);
    const store = await Storechema.findById(store_id);

    if (!store) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.store.resultCode,
        message: Json.create_order.error.store.message,
      };
    }

    const Itemschema = await dburi.model("items", ItemSchema.schema);

    const itemIds = order_data.map((itm) => itm.item_id).filter(Boolean);

    if (itemIds.length === 0) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.create.resultCode,
        message: Json.create_order.error.create.message,
      };
    }

    // Function to fetch item prices
    const getItemPrices = async () => {
      try {
        const prices = await Itemschema.find({
          store_id: store_id,
          _id: { $in: itemIds },
        }).select("_id item_price");

        const priceMap = prices.reduce((map, item) => {
          map[item._id] = item.item_price;
          return map;
        }, {});

        // Check if all items have valid prices
        const itemsWithPrices = order_data.map((itm) => {
          const price = priceMap[itm.item_id] || 0; // Handle missing price
          if (price === 0) {
            console.error(`Item ID ${itm.item_id} is missing a price.`);
          }
          return {
            ...itm,
            price,
          };
        });

        // Check for missing prices and return error if any found
        const missingPrices = itemsWithPrices.filter(
          (item) => item.price === 0
        );
        if (missingPrices.length > 0) {
          return {
            responseCode: 400,
            success: false,
            resultCode: Json.create_order.error.items.resultCode,
            message: Json.create_order.error.items.message,
          };
        }

        return itemsWithPrices;
      } catch (error) {
        console.error("Error fetching item prices:", error);
        throw error;
      }
    };

    const itemsWithPrices = await getItemPrices();

    if (itemsWithPrices.length === 0) return itemsWithPrices; // Handle error if prices missing

    const calculateTotalPrice = (items) => {
      return items.reduce((total, item) => total + parseFloat(item.price), 0);
    };

    const totalPrice = calculateTotalPrice(itemsWithPrices);
    const date = dayjs(order_date).format("YYYY-MM-DD");

    const getOrdersCount = await CreateOrderschema.countDocuments({
      store_id,
      order_date: date,
    });

    const Tip = tip || "0.00";

    const calculate = (
      parseFloat(totalPrice) +
      parseFloat(tax) +
      parseFloat(Tip)
    ).toFixed(2);

    let bodyData = {
      order_date,
      order_time,
      store_name: formattedName1,
      store_id,
      customer_name,
      discount,
      item_strike,
      order_data: itemsWithPrices,
      order_id:
        getOrdersCount < 9
          ? `000${getOrdersCount + 1}`
          : `00${getOrdersCount + 1}`,

      order_type: "Web-Order",
      pay_type,
      delivery_type: "Pick-Up",
      phone: phone || "",
      sub_total: totalPrice.toFixed(2),
      tax: parseFloat(tax).toFixed(2),
      balance_amount: parseFloat(balance_amount).toFixed(2),
      total_price: calculate,
      order_seconds,
      position: getOrdersCount,
      tip,
      customer_email,
    };

    if (pay_type === "Card") {
      const { randomUUID: uid } = new generateRandom({ length: 10 });
      const randomUUID = uid().toUpperCase();

      const expireYear = `${PaymentLink.aurora_card_expire_year}${expirationYear}`;

      const paymentData = {
        paymentProcessorId: paymentObject.availablePaymentProcessors[0].id,
        amount: calculate,
        currencyId: paymentObject.availableCurrencies[0].id,
        billingAddress: {
          city: billingAddress.city || null,
          countryId: billingAddress.countryId || 1,
          line1: billingAddress.line1,
          line2: null,
          postalCode: billingAddress.postalCode,
          stateId: billingAddress.stateId || 1,
        },
        contactInfo: {
          firstName: customer_name || null,
          lastName: null,
          email: customer_email || null,
          mobileNumber: phone || null,
        },
        accountNumber: accountNumber,
        securityCode: securityCode,
        expirationMonth: expirationMonth,
        expirationYear: Number(expireYear),
        cardDataSource: 1,
        referenceId: randomUUID,
      };

      const config = {
        method: "post",
        url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_web_order_create_sale}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        data: paymentData,
      };

      try {
        const { data } = await axios.request(config);
        if (
          (data.status === "Declined" || data.status === "Failed") &&
          data.details.authCode === null
        ) {
          const responeData = {
            datetime: data?.transactionDateTime,
            status: data?.status,
            hostresponsecode: data?.details?.hostResponseCode,
            hostresponsemessage: data?.details?.hostResponseMessage,
            processorresponsecode: data?.details?.processorResponseCode,
            authcode: data?.details?.authCode,
          };
          return {
            responseCode: 400,
            success: false,
            resultCode: Json.create_order.error.create.resultCode,
            message:
              data.status === "Failed"
                ? Json.create_order.error.create.message2
                : Json.create_order.error.create.message4,
            data: responeData,
          };
        } else {
          bodyData.payment_status = data.status;
          bodyData.transaction_id = data.transactionId;
          bodyData.payment_transaction = [
            {
              datetime: data?.transactionDateTime,
              status: data?.status,
              hostresponsecode: data?.details?.hostResponseCode,
              hostresponsemessage: data?.details?.hostResponseMessage,
              processorresponsecode: data?.details?.processorResponseCode,
              authcode: data?.details?.authCode,
            },
          ];
          bodyData.order_status = "Accepted";
          bodyData.payment_reference_id = randomUUID;
          bodyData.payment_terminal_id = `${merchant_name}/${store_name}`;
          bodyData.serial_no = ip_address || "";

          const getOrder = await CreateOrderschema.create(bodyData);

          const responseData = {
            transactionId: data.transactionId,
            status: data.status,
            order_id: getOrder.order_id,
            reference_id: getOrder.payment_reference_id,
            terminla_id: getOrder.payment_terminal_id,

            payment_transaction: {
              datetime: data?.transactionDateTime,
              status: data?.status,
              hostresponsecode: data?.details?.hostResponseCode,
              hostresponsemessage: data?.details?.hostResponseMessage,
              processorresponsecode: data?.details?.processorResponseCode,
              authcode: data?.details?.authCode,
            },
          };

          return {
            responseCode: 200,
            success: true,
            resultCode: Json.create_order.success.create.resultCode,
            message: Json.create_order.success.create.message,
            data: responseData,
          };
        }
      } catch (error) {
        return {
          responseCode: 400,
          success: false,
          resultCode: Json.create_order.error.create.resultCode,
          message: Json.create_order.error.create.message3,
          validation_error: Json.create_order.error.create.message4,
        };
      }
    } else {
      bodyData.order_status = "Pending";

      await CreateOrderschema.create(bodyData);
      return {
        responseCode: 200,
        success: true,
        resultCode: Json.create_order.success.create.resultCode,
        message: Json.create_order.success.create.message,
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

exports.refundPayment = async (req) => {
  const { transactionId, merchant_name, store_name } = req.body;

  const merchantname = merchant_name;
  const formattedName = merchantname.replace(/-/g, " ");

  const storename = store_name;
  const formattedName1 = storename.replace(/-/g, " ");

  try {
    const Merchant = await MerchantSchema.findOne({
      merchant_name: formattedName,
    });

    if (!Merchant) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.refundPayment.error.resultCode,
        message: Json.refundPayment.error.message2,
      };
    }

    const { dburi } = await AdminconnectTenantDB(Merchant._id);

    const Storechema = await dburi.model("stores", StoreSchema.schema);
    const store = await Storechema.findOne({
      store_name: formattedName1,
    });

    if (!store) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.refundPayment.error.resultCode,
        message: Json.refundPayment.error.message3,
      };
    }

    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );

    const orders = await CreateOrderschema.findOne({
      transaction_id: transactionId,
    });

    if (!orders) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.refundPayment.error.resultCode,
        message: Json.refundPayment.error.message4,
      };
    }

    const bodyData = {
      cardDataSource: 1,
      transactionId,
      amount: orders.total_price,
    };

    const { tokenResponse } = await paymentTokenGenerate();

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

      if (data.status !== "Declined") {
        await CreateOrderschema.findByIdAndUpdate(orders._id, {
          pay_type: "Refunded",
          payment_status: data.status,
          order_status: "Cancelled",
        });

        return {
          responseCode: 200,
          success: true,
          resultCode: Json.refundPayment.success.resultCode,
          message: Json.refundPayment.success.message,
        };
      } else {
        return {
          responseCode: 500,
          success: false,
          resultCode: Json.refundPayment.success.resultCode,
          message: Json.refundPayment.success.message1,
        };
      }
    } catch (error) {
      return {
        responseCode: 500,
        success: false,
        resultCode: Json.refundPayment.error.resultCode,
        message: Json.refundPayment.error.message,
        data_error: error.response.data.Errors.Amount[0],
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      success: true,
      resultCode: Json.refundPayment.error.resultCode,
      message: Json.refundPayment.error.message,
      data_error: error.message,
    };
  }
};
