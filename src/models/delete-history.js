const mongoose = require("mongoose");

const deleteHistory = new mongoose.Schema(
  {  
    category: {
      type: string,
      required: true,
    },
    merchant_id: {
        type: String,
    },
    store_id: {
        type: String,

    },
    delete_user_id: {
        type: String,
        required: true,
    },
    delete_type: {
      type: String,
      enum: ["merchant", "admin"],
    },
  },
  { timestamps: true }
);

const DeleteHistory = mongoose.model("delete_history", deleteHistory);

module.exports = DeleteHistory;
