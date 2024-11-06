const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 8 });

const admin = new mongoose.Schema(
  {
    admin_id: {
      type: String,
      required: true,
      unique: true,
      default: randomUUID(),
    },
    admin_phone: {
      type: String,
      required: true,
      unique: true,
    },
    admin_name: {
      type: String,
      required: true,
    },
    web_order_domain: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admins", admin);

module.exports = Admin;
