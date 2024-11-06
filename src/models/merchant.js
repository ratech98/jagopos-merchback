//merchant model

const mongoose = require("mongoose");
const { Bucket } = require("../utils/translate/bucket");

const merchant = new mongoose.Schema(
  {
    merchant_name: {
      type: String,
      required: true,
      unique: true,
    },
    merchant_phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    merchant_street: {
      type: String,
      required: true,
    },
    merchant_city: {
      type: String,
      required: true,
    },
    merchant_state: {
      type: String,
      required: true,
    },
    merchant_zip_code: {
      type: String,
      required: true,
    },
    contact_name: {
      type: String,
      required: true,
    },
    contact_phone_number: {
      type: String,
      required: true,
    },
    contact_street: {
      type: String,
      required: true,
    },
    contact_city: {
      type: String,
      required: true,
    },
    contact_state: {
      type: String,
      required: true,
    },
    contact_zip_code: {
      type: String,
      required: true,
    },
    bussiness_logo: {
      full_logo: {
        type: String,
        required: false,
        default: Bucket.default_merchant_full_logo,
      },
      small_logo: {
        type: String,
        required: false,
        default: Bucket.default_merchant_small_logo,
      },
    },
    plan_start_data: {
      type: String,
    },
    plan_end_date: {
      type: String,
    },
    pricing: {
      type: String,
      required: true,
      enum: ["1", "2", "3"],
    },
    add_method: {
      type: String,
      required: true,
      enum: ["merchant", "admin"],
    },
    db_uri: {
      type: String,
      required: true,
    },
    terms_condition: {
      type: String,
      required: true,
      default: true,
    },
    privacy_policy: {
      type: String,
      required: true,
      default: true,
    },
  },

  { timestamps: true }
);

const Merchant = mongoose.model("merchants", merchant);

module.exports = Merchant;
