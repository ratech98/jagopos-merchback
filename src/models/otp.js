const mongoose = require("mongoose");

const otp = new mongoose.Schema(
  {
    otp_id: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["merchant", "admin", "mobile", "token_app"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "5m" },
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model("otps", otp);

module.exports = OTP;
