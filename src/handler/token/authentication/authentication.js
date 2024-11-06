const MerchantSchema = require("../../../models/merchant");
const OTPSchema = require("../../../models/otp");
const jwt = require("jsonwebtoken");

const { Json } = require("../../../utils/translate/token");

exports.login = async (req) => {
  const { merchant_phone_number } = req.body;

  try {
    const merchant = await MerchantSchema.findOne({ merchant_phone_number });

    if (!merchant) {
      return {
        success: false,
        responseCode: 403,
        resultCode: Json.token_app_login.error.login_merchant.resultCode,
        message: Json.token_app_login.error.login_merchant.message,
      };
    }

    const dummyOTP = 123456;

    // Simulate OTP creation (Replace with actual OTP generation logic)
    const getOTPID = await OTPSchema.create({
      otp_id: merchant._id,
      otp: dummyOTP,
      type: "token_app",
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
      resultCode: Json.token_app_login.success.login_merchant.resultCode,
      message: Json.token_app_login.success.login_merchant.message,
      token,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.token_app_login.error.login_merchant.resultCode,
      message: Json.token_app_login.error.login_merchant.message,
      db_error: error.message,
    };
  }
};

exports.verify = async (req) => {
  const { id } = req;
  const { otp, type } = req.body;

  try {
    const findOTP = await OTPSchema.findOne({ _id: id, otp, type });

    if (findOTP) {
      const token = await jwt.sign(
        { id: findOTP.otp_id },

        process.env._JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const merchant = await MerchantSchema.findById(findOTP.otp_id);

      const responseData = {
        merchant_id: merchant._id,
        merchant_name: merchant.merchant_name,
        business_logo: merchant.bussiness_logo,
      }

      await OTPSchema.deleteOne({ _id: id, otp, type });
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.token_app_login.success.verify_otp.resultCode,
        message: Json.token_app_login.success.verify_otp.message,
        data: responseData,
        token,
      };
    } else {
      return {
        success: false,
        responseCode: 403,
        resultCode: Json.token_app_login.error.verify_otp.resultCode,
        message: Json.token_app_login.error.verify_otp.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.token_app_login.error.verify_otp.resultCode,
      message: Json.token_app_login.error.verify_otp.message,
      db_error: error.message,
    };
  }
};

exports.resendOtp = async (req) => {
  const { merchant_phone_number } = req.body;

  try {
    const merchant = await MerchantSchema.findOne({ merchant_phone_number });

    if (!merchant) {
      return {
        success: false,
        responseCode: 403,
        resultCode: Json.token_app_login.error.login_merchant.resultCode,
        message: Json.token_app_login.error.login_merchant.message,
      };
    }

    const dummyOTP = 123456;

    // Simulate OTP creation (Replace with actual OTP generation logic)
    const getOTPID = await OTPSchema.create({
      otp_id: merchant._id,
      otp: dummyOTP,
      type: "token_app",
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
      resultCode: Json.token_app_login.success.login_merchant.resultCode,
      message: Json.token_app_login.success.login_merchant.message1,
      token,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.token_app_login.error.login_merchant.resultCode,
      message: Json.token_app_login.error.login_merchant.message,
      db_error: error.message,
    };
  }
};

exports.getMerchant = async (req) => {
  const { id } = req;

  try {
    const merchant = await MerchantSchema.findOne({ _id: id });

    if (!merchant) {
      return {
        success: false,
        responseCode: 403,
        resultCode: Json.get_merchant.error.resultCode,
        message: Json.get_merchant.error.resultCode,
      };
    }

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.get_merchant.success.resultCode,
      message: Json.get_merchant.success.message,
      data: merchant,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.get_merchant.error.resultCode,
      message: Json.get_merchant.error.resultCode,
      db_error: error.message,
    };
  }
};
