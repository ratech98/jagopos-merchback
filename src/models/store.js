//store model

const mongoose = require("mongoose");
const { Bucket } = require("../utils/translate/bucket");

const store = new mongoose.Schema(
  {
    store_name: {
      type: String,
      required: true,
      unique: true,
    },
    store_phone: {
      type: String,
      required: true,
    },
    store_street: {
      type: String,
      required: true,
    },
    store_city: {
      type: String,
      required: true,
    },
    store_state: {
      type: String,
      required: true,
    },
    store_zip_code: {
      type: String,
      required: true,
    },
    store_image: {
      type: String,
      default: Bucket.default_store_image,
    },
    merchant_id: {
      type: mongoose.Types.ObjectId,
      ref: "merchants",
    },
    store_token: {
      type: String,
      default: "",
    },
    location: {
      latitude: {
        type: String,
        default: "",
      },
      longitude: {
        type: String,
        default: "",
      },
    },
    store_close_time: {
      type: String,
      default: "23:55",
    },
    store_open_time: {
      type: String,
      default: "10:00",
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("stores", store);

module.exports = Store;
