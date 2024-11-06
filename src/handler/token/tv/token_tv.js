const { ConnectDBToken, AdminconnectTenantDB } = require("../../../config");
const {
  StoreSchema,
  TokenSchema,
  CreateOrderSchema,
  DeviceSchema,
} = require("../../../models/common");
const jwt = require("jsonwebtoken");

const { Json } = require("../../../utils/translate/token");
const dayjs = require("dayjs");

exports.createstoretv = async (req) => {
  const { dburi, id } = req;
  const { name, store_id, code } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);
    const storeSchema = dburi.model("stores", StoreSchema.schema);
    const deviceSchema = dburi.model("devices", DeviceSchema.schema);

    const store = await storeSchema.findById(store_id);
    if (!store) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.tv.error.get_store.resultCode,
        message: Json.tv.error.get_store.message,
      };
    }
    const getToken = await dbtokenSchema.findOne({ code });

    if (!getToken) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.tv.error.update_tv.resultCode,
        message: Json.tv.error.update_tv.message2,
      };
    }

    const findImei = await deviceSchema.find({
      mac_address: getToken.mac_address,
      type: "TOKEN",
    });

    if (findImei?.length !== 0) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.tv.error.update_tv.resultCode,
        message: Json.tv.error.update_tv.message6,
      };
    }

    const filtered_tv = await deviceSchema.find({
      name,
      store_id,
      type: "TOKEN",
    });

    if (filtered_tv?.length !== 0) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.tv.error.update_tv.resultCode,
        message: Json.tv.error.update_tv.message5,
      };
    }

    const bodyData = {
      name,
      store_id,
      mac_address: getToken.mac_address,
      connected: true,
      type: "TOKEN",
      merchant_id: id,
      code: code,
    };

    const device = await deviceSchema.create(bodyData);

    const token = await jwt.sign(
      { id: id, store_id: store._id, device_id: device._id },

      process.env._JWT_SECRET_KEY
    );

    await dbtokenSchema.findOneAndUpdate(
      { code },
      { token: token, merchant_id: id }
    );

    return {
      success: true,
      responseCode: 201,
      resultCode: Json.tv.success.create.resultCode,
      message: Json.tv.success.create.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.tv.error.create.resultCode,
      message: Json.tv.error.create.message,
      db_error: error.message,
    };
  }
};

exports.getstoretv = async (req) => {
  const { dburi } = req;
  const { store_id } = req.body;

  try {
    const deviceSchema = dburi.model("devices", DeviceSchema.schema);

    const device = await deviceSchema
      .find({ store_id, type: "TOKEN" })
      .select(
        "name code type merchant_id store_id connected layOut show_name token_announcement mac_address"
      );

    if (!device) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.tv.error.get_tv.resultCode,
        message: Json.tv.error.get_tv.message,
      };
    }

    return {
      success: true,
      responseCode: 201,
      resultCode: Json.tv.success.get_tv.resultCode,
      message: Json.tv.success.get_tv.message,
      data: device,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.tv.error.get_tv.resultCode,
      message: Json.tv.error.get_tv.message,
      db_error: error.message,
    };
  }
};

exports.getOrders = async (req) => {
  const { id, store_id, device_id } = req;

  try {
    const { dburi } = await AdminconnectTenantDB(id);

    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );
    const Storeschema = await dburi.model("stores", StoreSchema.schema);
    const Deviceschema = await dburi.model("devices", DeviceSchema.schema);

    // Fetch store details
    const store = await Storeschema.findById(store_id);

    if (!store) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.get_orders.error.get_orders.resultCode,
        message: Json.get_orders.error.get_orders.message1,
      };
    }

    // Fetch device details
    const getTV = await Deviceschema.findById(device_id);

    if (!getTV) {
      return {
        responseCode: 400,
        success: false,
        code: "-1",
        resultCode: Json.get_orders.error.get_orders.resultCode,
        message: Json.get_orders.error.get_orders.message2,
      };
    }

    const date = dayjs().format("YYYY-MM-DD");

    // Fetch orders for the specified store and date, filtering by specific statuses
    const orders = await CreateOrderschema.find({
      store_id: store_id,
      order_status: { $in: ["Accepted", "Cooking", "Completed", "Ready"] },
      order_date: date,
    })
      .select("-__v")
      .sort({ updatedAt: -1 }); // Sort orders by updatedAt descending

    const type = getTV.layOut;
    let result = {};

    // Layout type 0: Only filter "Ready" orders
    if (type === 0) {
      result = {
        Ready: orders
          .filter((order) => order.order_status === "Ready")
          .sort((a, b) => b.updatedAt - a.updatedAt) // Sort by updatedAt ascending
          .slice(0, 30), // Limit to 30 items
      };
    }
    // Layout type 1: Filter "Completed" and "Ready" orders
    else if (type === 1) {
      result = {
        Completed: orders
          .filter((order) => order.order_status === "Completed")
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 10), // Limit to 10 items
        Ready: orders
          .filter((order) => order.order_status === "Ready")
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 20), // Limit to 20 items
      };
    }
    // Layout type 2: Filter "Accepted", "Cooking", "Ready", and "Completed" orders
    else {
      const cookingOrders = orders
        .filter((order) => order.order_status === "Cooking")
        .sort((a, b) => b.updatedAt - a.updatedAt);

      const acceptedOrders = orders
        .filter((order) => order.order_status === "Accepted")
        .sort((a, b) => b.updatedAt - a.updatedAt);

      const filterData = [...cookingOrders, ...acceptedOrders];

      result = {
        Cooking: filterData.slice(0, 10),
        Ready: orders
          .filter((order) => order.order_status === "Ready")
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 10), // Limit to 10 items
        Completed: orders
          .filter((order) => order.order_status === "Completed")
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 10), // Limit to 10 items
      };
    }

    const responseBody = {
      layOutType: getTV.layOut,
      orderData: result,
      show_name: getTV.show_name,
      token_announcement: getTV.token_announcement,
    };

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.get_orders.success.get_orders.resultCode,
      message: Json.get_orders.success.get_orders.message,
      data: responseBody,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.get_orders.error.get_orders.resultCode,
      message: Json.get_orders.error.get_orders.message,
      db_error: error.message,
    };
  }
};

exports.disconnect_tv = async (req) => {
  const { dburi } = req;
  const { tv_id } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const devicesSchema = dburi.model("devices", DeviceSchema.schema);

    const store = await devicesSchema.findById(tv_id);
    if (!store) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.disconnect_tv.error.disconnect_tv.resultCode,
        message: Json.disconnect_tv.error.disconnect_tv.message2,
      };
    }

    await dbtokenSchema.findOneAndDelete({
      mac_address: store.mac_address,
      type: store.type,
    });

    await devicesSchema.findByIdAndDelete(tv_id);

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.disconnect_tv.success.disconnect_tv.resultCode,
      message: Json.disconnect_tv.success.disconnect_tv.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.disconnect_tv.error.disconnect_tv.resultCode,
      message: Json.disconnect_tv.error.disconnect_tv.message,
      db_error: error.message,
    };
  }
};

exports.enableService = async (req) => {
  const { dburi } = req;
  const { tv_id, show_name, token_announcement, layout } = req.body;

  try {
    const deviceSchema = dburi.model("devices", DeviceSchema.schema);

    const device = await deviceSchema.findById(tv_id);
    if (!device) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.tv.error.update_tv.resultCode,
        message: Json.tv.error.update_tv.message1,
      };
    }

    const bodyData = {
      show_name: show_name !== undefined ? show_name : device.show_name,
      token_announcement:
        token_announcement !== undefined
          ? token_announcement
          : device.token_announcement,
      layOut: layout !== undefined ? layout : device.layOut,
    };

    const updateData = await deviceSchema
      .findByIdAndUpdate(tv_id, bodyData, {
        new: true,
      })
      .select(
        "name code type merchant_id store_id connected layOut show_name token_announcement mac_address"
      );

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.tv.success.update_tv.resultCode,
      message: Json.tv.success.update_tv.message,
      data: updateData,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.tv.error.update_tv.resultCode,
      message: Json.tv.error.update_tv.message,
      db_error: error.message,
    };
  }
};
