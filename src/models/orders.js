const mongoose = require("mongoose");

const createOrder = new mongoose.Schema(
  {
    order_date: {
      type: String,
      required: true,
    },
    order_time: {
      type: String,
      required: true,
    },
    store_name: {
      type: String,
      required: true,
    },
    store_id: {
      type: String,
      required: true,
      ref: "stores",
    },
    customer_name: {
      type: String,
    },
    // delivery_fee: {
    //   type: String,
    //   default: "00.00",
    // },
    discount: {
      type: String,
    },

    order_data: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        item_id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        no_data: {
          type: String,
        },
        extra_data: {
          type: String,
        },
        notes: [
          {
            text: {
              type: String,
            },
            strike: {
              type: Boolean,
            },
          },
        ],
        sub_item: [
          {
            id: {
              type: String,
            },
            name: {
              type: String,
            },
            extra: {
              type: Boolean,
            },
            no: {
              type: Boolean,
            },
            strike: {
              type: Boolean,
            },
          },
        ],
        item_strike: {
          type: Boolean,
          default: false,
        },
      },
    ],
    order_id: {
      type: String,
      required: true,
    },
    order_status: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Cancelled",
        "Rejected",
        "Paid",
        "Accepted",
        "Cooking",
        "Ready",
        "Completed",
      ],
    },
    order_type: {
      type: String,
      required: true,
      enm: [
        "Phone-Order",
        "Mobile-Order",
        "Web-Order",
        "Pos-Order",
        "Table-Order",
      ],
    },
    pay_type: {
      type: String,
      required: true,
      enum: ["Card", "Cash", "Pay-Later"],
    },
    delivery_type: {
      type: String,
      required: true,
      enum: ["Dine-In", "Pick-Up", "Delivery"],
    },
    phone: {
      type: String,
    },
    customer_email: {
      type: String,
    },

    sub_total: {
      type: String,
      required: true,
    },
    tax: {
      type: String,
      required: true,
    },
    total_price: {
      type: String,
      required: true,
    },
    balance_amount: {
      type: String,
    },
    timer: {
      type: Number,
      default: 0,
    },
    recall: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      default: null,
    },
    order_seconds: {
      type: String,
      default: "00",
    },
    closed_time: {
      type: String,
      default: "00:00:00",
    },
    tip: {
      type: String,
      default: "0.00",
    },
    payment_status: {
      type: String,
    },
    transaction_status_id: {
      type: String,
    },
    transaction_id: {
      type: String,
    },
    payment_reference_id: {
      type: String,
    },
    payment_terminal_id: {
      type: String,
    },
    serial_no: {
      type: String,
    },

    payment_transaction: [
      {
        _id: {
          type: mongoose.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        datetime: {
          type: String,
        },
        status: {
          type: String,
        },
        hostresponsecode: {
          type: String,
        },
        hostresponsemessage: {
          type: String,
        },
        processorresponsecode: {
          type: String,
        },
        authcode: {
          type: String,
        },
      },
    ],
  },

  { timestamps: true }
);

const CreateOrder = mongoose.model("orders", createOrder);

module.exports = CreateOrder;
