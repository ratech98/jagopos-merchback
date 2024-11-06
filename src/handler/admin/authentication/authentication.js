const { AdminSchema, OTPSchema } = require("../../../models/common");
const jwt = require("jsonwebtoken");

const { Json } = require("../../../utils/translate/admin");

exports.login = async (req) => {
  const { admin_phone } = req.body;

  const dummyOTP = 132241;

  try {
    const admin = await AdminSchema.findOne({ admin_phone });

    if (!admin) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.admin.error.login_admin.resultCode,
        message: Json.admin.error.login_admin.message,
      };
    }

    // Simulate OTP creation (Replace with actual OTP generation logic)
    const getOTPID = await OTPSchema.create({
      otp_id: admin.admin_id,
      otp: dummyOTP,
      type: "admin",
    });

    // Generate JWT token
    const token = await jwt.sign(
      { id: getOTPID._id },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.admin.success.login_admin.resultCode,
      message: Json.admin.success.login_admin.message,
      token,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.admin.error.login_admin.resultCode,
      message: Json.admin.error.login_admin.message,
      db_error: error.message,
    };
  }
};

exports.verifyOTP = async (req) => {
  const { id } = req;
  const { otp, type } = req.body;

  try {
    // Find the OTP in the database
    const findOTP = await OTPSchema.findOne({ _id: id, otp, type });

    // If OTP is found, delete it and generate a JWT token
    if (!findOTP) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.admin.error.verify_admin.resultCode,
        message: Json.admin.error.verify_admin.message,
      };
    }

    const admin = await AdminSchema.findOne({ admin_id: findOTP.otp_id });

    if (!admin) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.admin.error.login_admin.resultCode,
        message: Json.admin.error.login_admin.message,
      };
    }

    const token = await jwt.sign(
      { id: admin.admin_id },

      process.env._JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // await OTPSchema.deleteOne({ _id: id, otp: otp_token, type });
    return {
      success: true,
      responseCode: 200,
      resultCode: Json.admin.success.verify_admin.resultCode,
      message: Json.admin.success.verify_admin.message,
      token,
    };
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

exports.getAdminDetails = async (req) => {
  const { id } = req;

  try {
    const admin = await AdminSchema.findOne({ admin_id: id }).select(
      "-createdAt -updatedAt -__v"
    );

    if (!admin) {
      return {
        responseCode: 404,
        resultCode: Json.admin.error.token_error.resultCode,
        success: false,
        message: Json.admin.error.token_error.message,
      };
    }

    return {
      responseCode: 200,
      resultCode: Json.admin.success.get_admin.resultCode,
      success: true,
      message: Json.admin.success.get_admin.message,
      data: admin,
    };
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.admin.error.get_admin.resultCode,
      success: false,
      message: Json.admin.error.get_admin.message,
      db_error: error.message,
    };
  }
};


exports.resendOtp = async (req) => {
  const { admin_phone } = req.body;

  const dummyOTP = 132241;

  try {
    const admin = await AdminSchema.findOne({ admin_phone });

    if (!admin) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.admin.error.login_admin.resultCode,
        message: Json.admin.error.login_admin.message,
      };
    }

    // Simulate OTP creation (Replace with actual OTP generation logic)
    const getOTPID = await OTPSchema.create({
      otp_id: admin.admin_id,
      otp: dummyOTP,
      type: "admin",
    });

    // Generate JWT token
    const token = await jwt.sign(
      { id: getOTPID._id },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.admin.success.login_admin.resultCode,
      message: Json.admin.success.login_admin.message1,
      token,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.admin.error.login_admin.resultCode,
      message: Json.admin.error.login_admin.message,
      db_error: error.message,
    };
  }
};