const mongoose = require("mongoose");

const token = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    mac_address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    merchant_id: {
      type: mongoose.Types.ObjectId,
      ref: "merchants",
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("tokens", token);
module.exports = Token;
