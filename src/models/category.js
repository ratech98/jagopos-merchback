const mongoose = require("mongoose");

const category = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_image: {
      type: String,
      default: ""
    },
    category_status: {
      type: Boolean,
      required: true,
      default: true,
    },
    store_id: {
      type: mongoose.Types.ObjectId,
      ref: "stores",
    },
    merchant_id: {
      type: mongoose.Types.ObjectId,
      ref: "merchants",
    },
    items: [
      {
        type: mongoose.Types.ObjectId,
        ref: "items",
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("categories", category);

module.exports = Category;
