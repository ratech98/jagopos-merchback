const {
    StoreSchema,
    CategorySchema,
    ItemSchema,
    CreateOrderSchema,
  } = require("../../../models/common");
  
  const MerchantSchema = require("../../../models/merchant");
  
  const { AdminconnectTenantDB } = require("../../../config");

  const { Json } = require("../../../utils/translate/web-order");
  const {
    paymentTokenGenerate,
  } = require("../../../utils/payment-token-generate/generate-payment-token");
  
  const jwt = require("jsonwebtoken");
  const dayjs = require("dayjs");
  const generateRandom = require("short-unique-id");
  

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
        total_price
      } = req.body;
  
    //   const { tokenResponse } = await paymentTokenGenerate();
  
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
    //   const getItemPrices = async () => {
    //     try {
    //       const prices = await Itemschema.find({
    //         store_id: store_id,
    //         _id: { $in: itemIds },
    //       }).select("_id item_price");
  
    //       const priceMap = prices.reduce((map, item) => {
    //         map[item._id] = item.item_price;
    //         return map;
    //       }, {});
  
    //       // Check if all items have valid prices
    //       const itemsWithPrices = order_data.map((itm) => {
    //         const price = priceMap[itm.item_id] || 0; // Handle missing price
    //         if (price === 0) {
    //           console.error(`Item ID ${itm.item_id} is missing a price.`);
    //         }
    //         return {
    //           ...itm,
    //           price,
    //         };
    //       });
  
    //       // Check for missing prices and return error if any found
    //       const missingPrices = itemsWithPrices.filter(
    //         (item) => item.price === 0
    //       );
    //       if (missingPrices.length > 0) {
    //         return {
    //           responseCode: 400,
    //           success: false,
    //           resultCode: Json.create_order.error.items.resultCode,
    //           message: Json.create_order.error.items.message,
    //         };
    //       }
  
    //       return itemsWithPrices;
    //     } catch (error) {
    //       console.error("Error fetching item prices:", error);
    //       throw error;
    //     }
    //   };
  
    //   const itemsWithPrices = await getItemPrices();
  
    //   if (itemsWithPrices.length === 0) return itemsWithPrices; // Handle error if prices missing
  
    //   const calculateTotalPrice = (items) => {
    //     return items.reduce((total, item) => total + parseFloat(item.price), 0);
    //   };
  
    //   const totalPrice = calculateTotalPrice(itemsWithPrices);
      const date = dayjs(order_date).format("YYYY-MM-DD");
  
      const getOrdersCount = await CreateOrderschema.countDocuments({
        store_id,
        order_date: date,
      });
  
      const Tip = tip || "0.00";
  
    //   const calculate = (
    //     parseFloat(totalPrice) +
    //     parseFloat(tax) +
    //     parseFloat(Tip)
    //   ).toFixed(2);
  
      let bodyData = {
        order_date,
        order_time,
        store_name: formattedName1,
        store_id,
        customer_name,
        discount,
        item_strike,
        order_data,
        order_id:
          getOrdersCount < 9
            ? `000${getOrdersCount + 1}`
            : `00${getOrdersCount + 1}`,
  
        order_type: "Mobile-Order",
        pay_type,
        delivery_type: "Pick-Up",
        phone: phone || "",
        sub_total: parseFloat(total_price).toFixed(2),
        tax: tax,
        balance_amount: parseFloat(balance_amount).toFixed(2),
        total_price: parseFloat(total_price).toFixed(2),
        order_seconds,
        position: getOrdersCount,
        tip,
        customer_email,
      };
  
   
        bodyData.order_status = "Pending";
  
        await CreateOrderschema.create(bodyData);
        return {
          responseCode: 200,
          success: true,
          resultCode: Json.create_order.success.create.resultCode,
          message: Json.create_order.success.create.message,
        };
      
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

