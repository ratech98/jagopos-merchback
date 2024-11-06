const MerchantSchema = require("../../../models/merchant");
const OTPSchema = require("../../../models/otp");

const jwt = require("jsonwebtoken");

const { Json } = require("../../../utils/translate/merchant");

exports.login = async (req) => {
  const { merchant_phone } = req.body;

  const dummyOTP = 123456;

  try {
    const merchant = await MerchantSchema.findOne({
      merchant_phone_number: merchant_phone,
    });

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.merchant.error.login_merchant.resultCode,
        message: Json.merchant.error.login_merchant.message,
      };
    }

    await OTPSchema.deleteMany({ otp_id: merchant._id, type: "merchant" });

    const getOtpID = await OTPSchema.create({
      otp_id: merchant._id,
      otp: dummyOTP,
      type: "merchant",
    });

    const token = await jwt.sign(
      { id: getOtpID._id },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.merchant.success.login_merchant.resultCode,
      message: Json.merchant.success.login_merchant.message,
      token,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.login_merchant.resultCode,
      message: Json.merchant.error.login_merchant.message,
      error: error.message,
    };
  }
};

exports.verifyOTP = async (req) => {
  const { id } = req;
  const { otp, type } = req.body;

  try {
    const findOTP = await OTPSchema.findOne({ _id: id, otp, type });

    if (!findOTP) {
      return {
        success: false,
        responseCode: 403,
        resultCode: Json.merchant.error.verify_otp.resultCode,
        message: Json.merchant.error.verify_otp.message,
      };
    }

    const merchant = await MerchantSchema.findById(findOTP.otp_id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.merchant.error.login_merchant.resultCode,
        message: Json.merchant.error.login_merchant.message,
      };
    }

    const token = await jwt.sign(
      {
        id: merchant._id,
      },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    await OTPSchema.deleteOne({ _id: id, otp, type });
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.merchant.success.verify_otp.resultCode,
      message: Json.merchant.success.verify_otp.message,
      token,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.verify_otp.resultCode,
      message: Json.merchant.error.verify_otp.message,
      db_error: error.message,
    };
  }
};

exports.resendOTP = async (req) => {
  const { merchant_phone } = req.body;

  const dummyOTP = 123456;

  try {
    const merchant = await MerchantSchema.findOne({
      merchant_phone_number: merchant_phone,
    });

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.merchant.error.login_merchant.resultCode,
        message: Json.merchant.error.login_merchant.message,
      };
    }

    await OTPSchema.deleteMany({ otp_id: merchant._id, type: "merchant" });

    const getOtpID = await OTPSchema.create({
      otp_id: merchant._id,
      otp: dummyOTP,
      type: "merchant",
    });

    const token = await jwt.sign(
      { id: getOtpID._id },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.merchant.success.login_merchant.resultCode,
      message: Json.merchant.success.login_merchant.message1,
      token,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.login_merchant.resultCode,
      message: Json.merchant.error.login_merchant.message,
      error: error.message,
    };
  }
};
