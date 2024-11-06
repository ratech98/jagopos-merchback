const { ConnectDBToken } = require("../../../config");
const {
  TokenSchema,
  DeviceSchema,
  StoreSchema,
  MerchantSchema,
} = require("../../../models/common");

const { Json } = require("../../../utils/translate/token");
const { AdminconnectTenantDB } = require("../../../config");

exports.createToken = async (req) => {
  const { mac_address, type } = req.body;
  try {
    const alphaNumericCode = (length = 6) => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    };

    const code = alphaNumericCode();
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const find = await dbtokenSchema.find({ mac_address, type });

    if (find.length !== 0) {
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.create_token.success.create_token.resultCode,
        message: Json.create_token.success.create_token.message,
        data: find[0].code,
      };
    } else {

      const getToken = await dbtokenSchema.create({ code, mac_address, type });
  
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.create_token.success.create_token.resultCode,
        message: Json.create_token.success.create_token.message,
        data: getToken.code,
      };
    }

  } catch (error) {
    return {
      success: true,
      responseCode: 500,
      resultCode: Json.create_token.error.create_token.resultCode,
      message: Json.create_token.error.create_token.message,
      db_error: error.message,
    };
  }
};

exports.getCode = async (req) => {
  const { mac_address, type } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = await dbtokenuri.model("tokens", TokenSchema.schema);

    const getToken = await dbtokenSchema
      .find({ mac_address, type })
      .select("_id code mac_address type merchant_id token");

    if (getToken.length === 0) {
      return {
        code: "-1",
        success: false,
        responseCode: 404,
        resultCode: Json.get_code.error.get_code.resultCode,
        message: Json.get_code.error.get_code.message,
      };
    }

    if (getToken[0].merchant_id) {
      const { dburi } = await AdminconnectTenantDB(getToken[0].merchant_id);

      const storeSchema = await dburi.model("stores", StoreSchema.schema);

      const deviceSchema = await dburi.model("devices", DeviceSchema.schema);

      const device = await deviceSchema
        .findOne({ mac_address, type })
        .select(
          "-createdAt -updatedAt -__v  -layOut -show_name -token_announcement"
        )
        .populate({
          path: "store_id",
          select:
            "store_name store_phone store_street store_city store_state store_zip_code store_image store_token location store_close_time store_open_time",
          model: storeSchema,
        })
        .populate({
          path: "merchant_id",
          select: "_id merchant_name bussiness_logo",
          model: MerchantSchema,
        });

      if (!device) {
        await dbtokenSchema.findByIdAndDelete(getToken[0]._id) 
        return {
          code: "-1",
          success: false,
          responseCode: 404,
          resultCode: Json.get_code.error.get_code.resultCode,
          message: Json.get_code.error.get_code.message,
        };
      }

      const responseData = {
        device_details: device,
        getToken: getToken[0],
      };

      return {
        success: true,
        responseCode: 200,
        resultCode: Json.get_code.success.get_code.resultCode,
        message: Json.get_code.success.get_code.message,
        data: responseData,
      };
    } else {
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.get_code.success.get_code.resultCode,
        message: Json.get_code.success.get_code.message,
        data: { getToken: getToken[0] },
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.get_code.error.get_code.resultCode,
      message: Json.get_code.error.get_code.message,
      db_error: error.message,
    };
  }
};

exports.remove_code = async (req) => {
  const { mac_address } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const getToken = await dbtokenSchema.deleteOne({ mac_address });

    if (!getToken) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.remove_code.error.remove_code.resultCode,
        message: Json.remove_code.error.remove_code.message,
      };
    }

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.remove_code.success.remove_code.resultCode,
      message: Json.remove_code.success.remove_code.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.remove_code.error.remove_code.resultCode,
      message: Json.remove_code.error.remove_code.message,
      db_error: error.message,
    };
  }
};


exports.checkCode = async (req) => {
  const { type, code } = req.body;

  try {
    const { dbtokenuri } = await ConnectDBToken("db-token");

    const dbtokenSchema = dbtokenuri.model("tokens", TokenSchema.schema);

    const getToken = await dbtokenSchema.find({ type, code });

    const filter = getToken.filter(item => !item.merchant_id)

    if (filter.length === 0) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.check_code.error.resultCode,
        message: Json.check_code.error.message,
      };
    }

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.check_code.success.resultCode,
      message: Json.check_code.success.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.check_code.error.resultCode,
      message: Json.check_code.error.message,
      db_error: error.message,
    };
  }
};
