const mongoose = require("mongoose");

const clerk = new mongoose.Schema(
  {
    clerk_name: {
      type: String,
      required: true,
    },
    clerk_pin: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
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
  },
  { timestamps: true }
);

const Clerk = mongoose.model("clerk", clerk);

module.exports = Clerk;
