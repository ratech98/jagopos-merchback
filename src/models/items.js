const mongoose = require("mongoose");
const { Bucket } = require("../utils/translate/bucket");

const subSchema = new mongoose.Schema({
  name: String,
});

const item = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: true,
    },
    item_image: {
      type: String,
      default: Bucket.default_item_image,
    },
    item_price: {
      type: String,
      required: true,
    },
    item_description: {
      type: String,
    },
    item_available: {
      type: Boolean,
      required: true,
      default: true,
    },
    subItem: [subSchema],
    store_id: {
      type: mongoose.Types.ObjectId,
      ref: "stores",
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },
    merchant_id: {
      type: mongoose.Types.ObjectId,
      ref: "merchants",
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("items", item);

module.exports = Item;
