const { PaymentLink } = require("../../../utils/translate/aurora-payment");
const {
  StoreSchema,
  DeviceSchema,
  TokenSchema,
} = require("../../../models/common");
const jwt = require("jsonwebtoken");

const { Json } = require("../../../utils/translate/token");
const axios = require("axios");
const {
  paymentTokenGenerate,
} = require("../../../utils/payment-token-generate/generate-payment-token");

const { ConnectDBToken } = require("../../../config");
exports.createPos = async (req) => {
  const { dburi, id } = req;
  const { name, store_id, code, type, serial_no } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const findToken = await dbtokenSchema.findOne({ type, code });

    if (!findToken) {
      return {
        success: false,
        responseCode: 500,
        resultCode: Json.tv.error.create.resultCode,
        message: Json.tv.error.create.message,
      };
    }

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

    const filtered_pos = await deviceSchema.find({
      name,
      store_id,
      type,
    });

    if (filtered_pos?.length !== 0) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.tv.error.update_tv.resultCode,
        message: Json.tv.error.update_tv.message4,
      };
    }

    let terminalID;

    if (type === "POS") {
      const findTerminal = await deviceSchema.find({
        serial_no,
        type,
      });

      if (findTerminal?.length !== 0) {
        if (findTerminal.serial_no !== serial_no) {
          return {
            success: false,
            responseCode: 400,
            resultCode: Json.tv.error.update_tv.resultCode,
            message: Json.tv.error.update_tv.message8,
          };
        }
      }

      const { tokenResponse } = await paymentTokenGenerate();

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
          (item) => item.serialNumber === serial_no
        );
        if (match) {
          terminalID = match.id;
        } else {
          return {
            success: false,
            responseCode: 400,
            resultCode: Json.tv.error.update_tv.resultCode,
            message: Json.tv.error.update_tv.message9,
          };
        }
      } catch (error) {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.tv.error.update_tv.resultCode,
          message: error.message,
        };
      }
    }

    let bodyData;

    if (type === "POS") {
      bodyData = {
        name,
        store_id,
        serial_no: serial_no,
        connected: true,
        terminal_id: terminalID,
        merchant_id: id,
        mac_address: findToken.mac_address,
        type,
        code
      };
    } else {
      bodyData = {
        name,
        store_id,
        connected: true,
        merchant_id: id,
        mac_address: findToken.mac_address,
        type,
        code
      };
    }

    await deviceSchema.create(bodyData);

    const token = await jwt.sign(
      {
        id: id,
        user: "merchant",
        mac_address: findToken.mac_address,
        type: type,
      },

      process.env._JWT_SECRET_KEY
      // { expiresIn: "7d" }
    );

    await dbtokenSchema.findByIdAndUpdate(findToken._id, {
      token,
      merchant_id: id,
    });

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

exports.getPos = async (req) => {
  const { dburi } = req;
  const { store_id, type } = req.body;

  try {
    const deviceSchema = dburi.model("devices", DeviceSchema.schema);

    const devices = await deviceSchema
      .find({ store_id, type })
      .select(
        "name code type merchant_id connected mac_address name store_id terminal_id serial_no"
      );

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.tv.success.get_tv.resultCode,
      message: Json.tv.success.get_tv.message,
      data: devices,
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

exports.disconnect_tv = async (req) => {
  const { dburi } = req;
  const { device_id } = req.body;

  try {
    const deviceSchema = dburi.model("devices", DeviceSchema.schema);

    const device = await deviceSchema.findById(device_id);
    if (!device) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.disconnect_tv.error.disconnect_tv.resultCode,
        message: Json.disconnect_tv.error.disconnect_tv.message2,
      };
    }
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    await dbtokenSchema.findOneAndDelete({
      mac_address: device.mac_address,
      type: device.type,
    });

    await deviceSchema.findByIdAndDelete(device_id);

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.disconnect_tv.success.disconnect_tv.resultCode,
      message: Json.disconnect_tv.success.disconnect_tv.message1,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.disconnect_tv.error.disconnect_tv.resultCode,
      message: Json.disconnect_tv.error.disconnect_tv.message4,
      db_error: error.message,
    };
  }
};

exports.updateTerminal = async (req) => {
  const { dburi } = req;
  const { device_id, serial_no } = req.body;

  try {
    const deviceSchema = dburi.model("devices", DeviceSchema.schema);

    const getToken = await deviceSchema.findOne({ _id: device_id });

    if (!getToken) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.update_device.error.resultCode,
        message: Json.update_device.error.message1,
      };
    }

    const filtered_pos = await deviceSchema.find({
      serial_no,
      type: "POS",
    });

    if (filtered_pos?.length !== 0) {
      if (device_id !== filtered_pos?.[0]?._id) {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.update_device.error.resultCode,
          message: Json.update_device.error.message2,
        };
      }
    }

    let terminalID;

    const { tokenResponse } = await paymentTokenGenerate();

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

      const match = data.items.find((item) => item.serialNumber === serial_no);
      if (match) {
        terminalID = match.id;
      } else {
        return {
          success: false,
          responseCode: 400,
          resultCode: Json.update_device.error.resultCode,
          message: Json.update_device.error.message3,
        };
      }
    } catch (error) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.update_device.error.resultCode,
        message: error.message,
      };
    }

    await deviceSchema.findByIdAndUpdate(device_id, {
      serial_no,
      terminal_id: terminalID,
    });

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.update_device.success.resultCode,
      message: Json.update_device.success.message,
    };
  } catch (error) {
    return {
      success: true,
      responseCode: 500,
      resultCode: Json.update_device.error.resultCode,
      message: Json.update_device.error.message,
      db_error: error.message,
    };
  }
};
