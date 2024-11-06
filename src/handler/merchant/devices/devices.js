const {
  DeviceSchema,
  TokenSchema,
  StoreSchema,
} = require("../../../models/common");
const { Json } = require("../../../utils/translate/merchant");
const { ConnectDBToken } = require("../../../config");
const axios = require("axios");
const {
  paymentTokenGenerate,
} = require("../../../utils/payment-token-generate/generate-payment-token");
const { PaymentLink } = require("../../../utils/translate/aurora-payment");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

exports.createPosDevice = async (req) => {
  const { dburi, id } = req;
  const { device_type, device_name, store_id, device_code, device_serial_no } =
    req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const deviceSchema = dburi.model("devices", DeviceSchema.schema);
    const storeSchema = dburi.model("stores", StoreSchema.schema);
    const tokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const findToken = await tokenSchema.find({
      type: device_type,
      code: device_code,
    });
    if (findToken.length === 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.pos.error.resultCode,
        message: Json.cerate_device.pos.error.message2,
      };
    }

    const findStore = await storeSchema.find({ _id: store_id });
    if (findStore.length === 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.pos.error.resultCode,
        message: Json.cerate_device.pos.error.message1,
      };
    }

    const findMacAddress = await deviceSchema.find({
      mac_address: findToken[0].mac_address,
      type: device_type,
    });

    if (findMacAddress.length !== 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.pos.error.resultCode,
        message: Json.cerate_device.pos.error.message3,
      };
    }

    const findDevice = await deviceSchema.find({
      serial_no: device_serial_no,
      type: device_type,
    });

    if (findDevice.length !== 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.pos.error.resultCode,
        message: Json.cerate_device.pos.error.message4,
      };
    }

    const { tokenResponse } = await paymentTokenGenerate();

    let terminalID;

    const listAllTerminal = {
      method: "get",
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_terminal_list}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    };

    try {
      const { data } = await axios.request(listAllTerminal);

      const match = data.items.find(
        (item) => item.serialNumber === device_serial_no
      );
      if (match) {
        terminalID = match.id;
      } else {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.cerate_device.pos.error.resultCode,
          message: Json.cerate_device.pos.error.message5,
        };
      }
    } catch (error) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.cerate_device.pos.error.resultCode,
        message: error.message,
      };
    }

    const bodyData = {
      name: device_name,
      code: device_code,
      type: device_type,
      merchant_id: id,
      store_id: store_id,
      connected: true,
      mac_address: findToken[0].mac_address,
      terminal_id: terminalID,
      serial_no: device_serial_no,
    };

    await deviceSchema.create(bodyData);

    const token = await jwt.sign(
      {
        id: id,
        user: "merchant",
        mac_address: findToken[0].mac_address,
        type: device_type,
      },

      process.env._JWT_SECRET_KEY
      // { expiresIn: "7d" }
    );

    await tokenSchema.findByIdAndUpdate(findToken[0]._id, {
      token,
      merchant_id: new ObjectId(`${id}`),
    });

    return {
      responseCode: 201,
      success: true,
      result_code: Json.cerate_device.pos.success.resultCode,
      message: Json.cerate_device.pos.success.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      result_code: Json.cerate_device.pos.error.resultCode,
      message: Json.cerate_device.pos.error.message,
      db_error: error.message,
    };
  }
};

exports.createKdsDevice = async (req) => {
  const { dburi, id } = req;
  const { device_type, device_name, store_id, device_code } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const deviceSchema = dburi.model("devices", DeviceSchema.schema);
    const storeSchema = dburi.model("stores", StoreSchema.schema);
    const tokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const findToken = await tokenSchema.find({
      type: device_type,
      code: device_code,
    });
    if (findToken.length === 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.kds.error.resultCode,
        message: Json.cerate_device.kds.error.message2,
      };
    }

    const findStore = await storeSchema.find({ _id: store_id });
    if (findStore.length === 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.kds.error.resultCode,
        message: Json.cerate_device.kds.error.message1,
      };
    }

    const findMacAddress = await deviceSchema.find({
      mac_address: findToken[0].mac_address,
      type: device_type,
    });

    if (findMacAddress.length !== 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.kds.error.resultCode,
        message: Json.cerate_device.kds.error.message3,
      };
    }

    const bodyData = {
      name: device_name,
      code: device_code,
      type: device_type,
      merchant_id: id,
      store_id: store_id,
      connected: true,
      mac_address: findToken[0].mac_address,
    };

    await deviceSchema.create(bodyData);

    const token = await jwt.sign(
      {
        id: id,
        user: "merchant",
        mac_address: findToken[0].mac_address,
        type: device_type,
      },

      process.env._JWT_SECRET_KEY
      // { expiresIn: "7d" }
    );

    await tokenSchema.findByIdAndUpdate(findToken[0]._id, {
      token,
      merchant_id: new ObjectId(`${id}`),
    });

    return {
      responseCode: 201,
      success: true,
      result_code: Json.cerate_device.kds.success.resultCode,
      message: Json.cerate_device.kds.success.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      result_code: Json.cerate_device.kds.error.resultCode,
      message: Json.cerate_device.kds.error.message,
      db_error: error.message,
    };
  }
};

exports.createTokenDevice = async (req) => {
  const { dburi, id } = req;
  const { device_type, device_name, store_id, device_code } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const deviceSchema = dburi.model("devices", DeviceSchema.schema);
    const storeSchema = dburi.model("stores", StoreSchema.schema);
    const tokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const findToken = await tokenSchema.find({
      type: device_type,
      code: device_code,
    });
    if (findToken.length === 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.token.error.resultCode,
        message: Json.cerate_device.token.error.message2,
      };
    }

    const findStore = await storeSchema.find({ _id: store_id });
    if (findStore.length === 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.token.error.resultCode,
        message: Json.cerate_device.token.error.message1,
      };
    }

    const findMacAddress = await deviceSchema.find({
      mac_address: findToken[0].mac_address,
      type: device_type,
    });

    if (findMacAddress.length !== 0) {
      return {
        responseCode: 400,
        success: false,
        result_code: Json.cerate_device.token.error.resultCode,
        message: Json.cerate_device.token.error.message3,
      };
    }

    const bodyData = {
      name: device_name,
      code: device_code,
      type: device_type,
      merchant_id: id,
      store_id: store_id,
      connected: true,
      mac_address: findToken[0].mac_address,
    };

    const device = await deviceSchema.create(bodyData);

    const token = await jwt.sign(
      {
        id: id,
        store_id: store_id,
        device_id: device._id,
      },

      process.env._JWT_SECRET_KEY
      // { expiresIn: "7d" }
    );

    await tokenSchema.findByIdAndUpdate(findToken[0]._id, {
      token,
      merchant_id: new ObjectId(`${id}`),
    });

    return {
      responseCode: 201,
      success: true,
      result_code: Json.cerate_device.token.success.resultCode,
      message: Json.cerate_device.token.success.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      result_code: Json.cerate_device.token.error.resultCode,
      message: Json.cerate_device.token.error.message,
      db_error: error.message,
    };
  }
};

exports.getDevices = async (req) => {
  const { dburi } = req;
  const { page = 1, limit = 10 } = req.query;
  const setDefaultPage = Number(page);
  const setDefaultPageLimit = Number(limit);
  const { store_id, device_type } = req.body;

  try {
    const Devicechema = await dburi.model("devices", DeviceSchema.schema);

    const totalDocuments = await Devicechema.countDocuments({
      store_id: store_id,
      type: device_type,
    });
    const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);
    const devices = await Devicechema.find({
      store_id: store_id,
      type: device_type,
    })
      .skip((setDefaultPage - 1) * setDefaultPageLimit)
      .limit(setDefaultPageLimit)
      .lean();

    const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
    const endRow = startRow + devices.length - 1;

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.get_devices.success.resultCode,
      message: Json.get_devices.success.message,
      data: devices,
      totalPages,
      currentPage: setDefaultPage,
      limit: setDefaultPageLimit,
      totalCount: totalDocuments,
      showingRow: `${startRow} - ${endRow}`,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      result_code: Json.get_devices.error.resultCode,
      message: Json.get_devices.error.message,
      db_error: error.message,
    };
  }
};

exports.deleteDevice = async (req) => {
  const { dburi } = req;
  const { device_id } = req.body;
  try {
    const Devicechema = await dburi.model("devices", DeviceSchema.schema);

    const findDevice = await Devicechema.findById(device_id);
    if (!findDevice) {
      return {
        responseCode: 404,
        success: false,
        result_code: Json.delete_device.error.resultCode,
        message: Json.delete_device.error.message1,
      };
    }

    const { dbtokenuri } = await ConnectDBToken("db-token");

    const tokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    await tokenSchema.findOneAndDelete({
      mac_address: findDevice.mac_address,
      type: findDevice.type,
    });

    await Devicechema.findByIdAndDelete(device_id);

    return {
      responseCode: 200,
      success: true,
      result_code: Json.delete_device.success.resultCode,
      message: Json.delete_device.success.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      result_code: Json.delete_device.error.resultCode,
      message: Json.delete_device.error.message,
      db_error: error.message,
    };
  }
};
