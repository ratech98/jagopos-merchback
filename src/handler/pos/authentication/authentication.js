const {
  OTPSchema,
  ClerkSchema,
  StoreSchema,
  DeviceSchema,
} = require("../../../models/common");
const MerchantSchema = require("../../../models/merchant");
const jwt = require("jsonwebtoken");
const { AdminconnectTenantDB } = require("../../../config");

const { Json } = require("../../../utils/translate/pos");

exports.login = async (req) => {
  const { merchant_phone } = req.body;

  try {
    const merchant = await MerchantSchema.findOne({
      merchant_phone_number: merchant_phone,
    });

    if (!merchant) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.merchant.error.merchant_login.resultCode,
        message: Json.merchant.error.merchant_login.message1,
      };
    }

    const dummyOTP = 123456;

    // Simulate OTP creation (Replace with actual OTP generation logic)
    const getOTPID = await OTPSchema.create({
      otp_id: merchant._id,
      otp: dummyOTP,
      type: "mobile",
    });

    // Generate JWT token
    const token = await jwt.sign(
      { id: getOTPID._id },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.merchant.success.merchant_login.resultCode,
      message: Json.merchant.success.merchant_login.message,
      token,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.merchant_login.resultCode,
      message: Json.merchant.error.merchant_login.message,
      db_error: error.message,
    };
  }
};

exports.verifyOTP = async (req) => {
  const { id } = req;
  const { otp, type, mac_address } = req.body;

  try {
    const findOTP = await OTPSchema.findOne({ _id: id, otp, type });

    if (findOTP) {
      const merchant = await MerchantSchema.findById(findOTP.otp_id);

      const { dburi } = await AdminconnectTenantDB(findOTP.otp_id);

      const deviceSchema = await dburi.model("devices", DeviceSchema.schema);
      const getDevice = await deviceSchema.find({ mac_address, type: "POS" });

      await OTPSchema.deleteOne({ _id: id, otp, type });

      let bodyResponse;

      if (getDevice.length !== 0) {
        const token = await jwt.sign(
          {
            id: merchant._id,
            user: "merchant",
            mac_address: getDevice[0].mac_address,
            type: "POS"
          },

          process.env._JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );

        bodyResponse = {
          success: true,
          responseCode: 200,
          resultCode: Json.merchant.success.verify_otp.resultCode,
          message: Json.merchant.success.verify_otp.message,
          token,
          merchant_id: merchant._id,
          merchant_name: merchant.merchant_name,
          business_logo: merchant.bussiness_logo,
        };
      } else {
        bodyResponse = {
          success: true,
          responseCode: 200,
          resultCode: Json.merchant.success.verify_otp.resultCode,
          message: Json.merchant.success.verify_otp.message,
          merchant_id: merchant._id,
          merchant_name: merchant.merchant_name,
          business_logo: merchant.bussiness_logo,
        };
      }

      return bodyResponse;
    } else {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.merchant.error.verify_otp.resultCode,
        message: Json.merchant.error.verify_otp.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.admin.error.verify_admin.resultCode,
      message: Json.admin.error.verify_admin.message,
      db_error: error.message,
    };
  }
};

exports.clerklogin = async (req) => {
  const { id, dburi, mac_address } = req;
  const { password } = req.body;

  const Storeschema = dburi.model("stores", StoreSchema.schema);
  const Clerkschema = dburi.model("clerks", ClerkSchema.schema);
  const deviceschema = dburi.model("devices", DeviceSchema.schema);

  try {
    const getClerk = await Clerkschema.find({ merchant_id: id }).populate([
      {
        path: "store_id",
        select: "store_name store_phone store_street store_city store_state store_zip_code store_image store_token location store_close_time store_open_time",
        model: Storeschema,
      },
      {
        path: "merchant_id",
        select: "merchant_name _id bussiness_logo",
        model: MerchantSchema,
      },
    ]);

    if (getClerk.length === 0) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.merchant.error.clerk_login.resultCode,
        message: Json.merchant.error.clerk_login.message2,
      };
    }

    const clerk = getClerk.find((clerk) => clerk.clerk_pin === password);

    const findMac = await deviceschema.find({ mac_address, type: "POS" });

    const store = await Storeschema.findOne({
      _id: clerk.store_id,
      merchant_id: id,
    });

    if (!store) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.merchant.error.clerk_login.resultCode,
        message: Json.merchant.error.clerk_login.message3,
      };
    }

    if (!clerk) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.merchant.error.clerk_login.resultCode,
        message: Json.merchant.error.clerk_login.message1,
      };
    }

    if (findMac.length === 0) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.merchant.error.clerk_login.resultCode,
        message: Json.merchant.error.clerk_login.message4,
      };
    }

    const token = await jwt.sign(
      { user: "clerk", id: id, mac_address: findMac[0].mac_address, type: "POS" },

      process.env._JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.merchant.success.clerk_login.resultCode,
      message: Json.merchant.success.clerk_login.message,
      data: clerk,
      token,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.merchant.error.clerk_login.resultCode,
      message: Json.merchant.error.clerk_login.message1,
      db_error: error.message,
    };
  }
};

exports.resendOtp = async (req) => {
  const { merchant_phone } = req.body;

  try {
    const merchant = await MerchantSchema.findOne({
      merchant_phone_number: merchant_phone,
    });

    if (!merchant) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.merchant.error.merchant_login.resultCode,
        message: Json.merchant.error.merchant_login.message1,
      };
    }

    const dummyOTP = 123456;

    // Simulate OTP creation (Replace with actual OTP generation logic)
    const getOTPID = await OTPSchema.create({
      otp_id: merchant._id,
      otp: dummyOTP,
      type: "mobile",
    });

    // Generate JWT token
    const token = await jwt.sign(
      { id: getOTPID._id },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.merchant.success.merchant_login.resultCode,
      message: Json.merchant.success.merchant_login.message,
      token,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.merchant_login.resultCode,
      message: Json.merchant.error.merchant_login.message,
      db_error: error.message,
    };
  }
};

exports.createCode = async (req) => {
  const { mac_address, merchant_id} = req.body;

  const { dburi } = await AdminconnectTenantDB(merchant_id);

  const deviceSchema = dburi.model("devices", DeviceSchema.schema);

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

    const findMac = await deviceSchema.find({ mac_address, type: "POS" });


    if (findMac?.length !== 0) {
      return {
        success: true,
        responseCode: 400,
        resultCode: Json.create_code.error.resultCode,
        message: Json.create_code.error.message1,
      };
    }

    const getToken = await deviceSchema.create({
      code,
      type: "POS",
      merchant_id: merchant_id,
      mac_address,
    });

    const token = await jwt.sign(
      {
        id: merchant_id,
        user: "merchant",
      },

      process.env._JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.create_code.success.resultCode,
      message: Json.create_code.success.message,
      data: { code: getToken.code, token },
    };
  } catch (error) {
    return {
      success: true,
      responseCode: 500,
      resultCode: Json.create_code.error.resultCode,
      message: Json.create_code.error.message,
      db_error: error.message,
    };
  }
};

exports.getCode = async (req) => {
  const { dburi, id } = req;
  const { mac_address } = req.body;

  const deviceSchema = dburi.model("devices", DeviceSchema.schema);
  const storeSchema = dburi.model("stores", StoreSchema.schema);

  try {
    const getToken = await deviceSchema
      .findOne({ mac_address, type: "POS" })
      .select(
        "code type merchant_id connected mac_address name store_id terminal_id serial_no"
      )
      .populate({
        path: "store_id",
        select:
          "store_name store_phone store_street store_city store_state store_zip_code store_image store_token location",
        model: storeSchema,
      });

    if (!getToken) {
      return {
        success: false,
        responseCode: 200,
        resultCode: Json.get_code.error.resultCode,
        message: Json.get_code.error.message,
      };
    }

    let responseBody;

    if (getToken.connected) {
      const token = await jwt.sign(
        {
          id: id,
          user: "merchant",
          mac_address: getToken.mac_address,
          type: "POS"
        },

        process.env._JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      responseBody = { device_details: getToken, token };
    } else {
      responseBody = {
        code: getToken.code,
      };
    }

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.get_code.success.resultCode,
      message: Json.get_code.success.message,
      data: responseBody,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.get_code.error.resultCode,
      message: Json.get_code.error.message,
      db_error: error.message,
    };
  }
};
