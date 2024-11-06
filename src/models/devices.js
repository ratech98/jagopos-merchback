const mongoose = require("mongoose");

const devices = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
    },
    type: {
      type: String,
      enum: ["TOKEN", "POS", "KDS"],
    },
    merchant_id: {
      type: mongoose.Types.ObjectId,
      ref: "merchants",
    },
    store_id: {
      type: mongoose.Types.ObjectId,
      ref: "stores",
    },
    connected: {
      type: Boolean,
      default: false,
    },
    layOut: {
      type: Number,
      default: 0,
    },
    show_name: {
      type: Boolean,
      default: false,
    },
    token_announcement: {
      type: Boolean,
      default: false,
    },
    mac_address: {
      type: String,
    },
    terminal_id: {
      type: String,
    },
    serial_no: {
      type: String,
    }
  },
  { timestamps: true }
);

const Devices = mongoose.model("devices", devices);

module.exports = Devices;
