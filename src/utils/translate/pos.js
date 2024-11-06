exports.Json = {
  merchant: {
    success: {
      merchant_login: {
        resultCode: 1311,
        message: "OTP send successfully",
        message1: "Resend OTP send successfully",

      },
      verify_otp: {
        resultCode: 1311,
        message: "Successfully get merchant",
      },
      clerk_login: {
        resultCode: 1312,
        message: "Successfully get clerk",
      },
    },
    error: {
      merchant_login: {
        resultCode: -1212,
        message: "Unable to get merchant",
        message1: "Invalid Merchant Phone Number",

        
      },
      verify_otp: {
        resultCode: -1311,
        // message: "Invalid OTP",
        message: "Authentication failed; Bad JWT token",

      },
      clerk_login: {
        resultCode: -1312,
        message: "Unable to get merchant",
        message1: "Invalid clerk",
        message2: "Unable to get clerk",
        message3: "Invalid store ID",
        message4: "Device is not available in store app",

      },
    },
    request_body: {
      login_merchant: {
        resultCode: -1311,
        errors: {
          error: "Merchant Phone is required",
        },
      },
      verify_otp: {
        resultCode: -1311,
        errors: {
          error: "OTP is required",
          error2: "Type is required",
        },
      },
      clerk_login: {
        resultCode: -1312,
        errors: {
          error: "Clerk password is required",
        },
      },
    },
  },
  category: {
    success: {
      get_categories: {
        resultCode: 1212,
        message: "Successfully get categories",
      },
    },
    error: {
      get_categories: {
        resultCode: -1212,
        message: "Unable to get category",
      },
      token_error: {
        resultCode: -1212,
        message: "Authentication failed; Bad JWT token",
      },
    },
  },
  item: {
    success: {
      get_all_items: {
        resultCode: 1301,
        message: "Successfully get all items",
      },
    },
    error: {
      get_all_items: {
        resultCode: -1301,
        message: "Unable to download store data",
      },
      token_error: {
        resultCode: -1301,
        message: "Authentication failed; Bad JWT token",
        message1: "Invalid Store ID",
        message2: "Category is not available",
        message3: "Clerk dont have access to get download store data",
        message4: "Invalid merchant ID",
      },
    },
    request_body: {
      get_all_items: {
        resultCode: -1301,
        errors: {
          error: "store_id is required",
          error2: "merchant_id is required",


        },
      },
      update_order: {
        resultCode: -1101,
        errors: {
          error: "order_id is required",
          error2: "order_status is required",
          error3: "order_date is required"
        }
      }
    },
  },
  create_order: {
    success: {
      create: {
        resultCode: 1321,
        message: "Successfully added order",
      },
      get_orders: {
        resultCode: 1322,
        message: "Successfully get orders",
      },
      get_order: {
        resultCode: 1322,
        message: "Successfully get order",
      },
      update_order: {
        resultCode: 1212,
        message: "Successfully update order",
      },
      payment_status: {
        resultCode: 1212,
        message: "Payment status retrieved successfully",
      }
    },
    error: {
      create: {
        resultCode: -1321,
        message: "Unable to create order",
        message1: "Transaction is already in progress",
        message2: "Request timeout: No response from the aurora payment server",
        message3: "The restaurant is closed. You cannot place an order.",

      },
      items: {
        resultCode: -1321,
        message: "Unable to get items",
      },
      payment_status: {
        resultCode: -1212,
        message: "Payment status retrieved",
      },
      store: {
        resultCode: -1321,
        message: "Unable to get store",
      },
      get_orders: {
        resultCode: -1322,
        message: "Unable to get orders data",
        message1: "Invalid store ID",
        message2: "Invalid merchant ID",
      },
      get_order: {
        resultCode: -1322,
        message: "Unable to get order data",
        message1: "Invalid store ID",
        message2: "Invalid merchant ID",
      },
      update_order: {
        resultCode: -1323,
        message: "Unable to update order",
        message1: "Unable to get order data",
      },
      token_error: {
        resultCode: -1321,
        message: "Authentication failed; Bad JWT token",
        message1: "Invalid Store ID",
        message2: "Category is not available",
      },
    },
    request_body: {
      create: {
        resultCode: -1321,
        errors: {
          error: "order_date is required",
          error2: "order_time is required",
          error3: "store_name is required",
          error4: "store_id is required",
          error5: "cusomer_name is required",
          // error6: "delivery_fee is required",
          error7: "discount_on is required",
          error8: "item_strike is required",
          error9: "orderdata array is required",
          // error10: "orderId is required",
          error11: "order_status is required",
          error12: "order_type is required",
          error13: "pay_type is required",
          error14: "phone is required",
          error15: "sub_total is required",
          error16: "tax is required",
          error17: "total_price is required",
          error18: "delivery_type is required",
          error19: "terminal_id is required",



        },
      },
      update_order: {
        resultCode: -1323,
        errors: {
          error: "order_id is required",
          error2: "store_id is required",
          error3: "order_date is required",
          error4: "payment_status is required",
          error5: "transaction_details is required",
          error6: "datetime is required",
          error7: "status is required",


        }
      },
      get_orders: {
        resultCode: -1322,
        errors: {
          error: "merchant_id is required",
          error2: "store_id is required",
        }
      },
      get_order: {
        resultCode: -1322,
        errors: {
          error: "store_id is required",
          error2: "order_id is required",

        }
      }
    },
  },
  store: {
    success: {
      get_store: {
        resultCode: 1112,
        message: "Successfully get stores",
      },
      
    },
    error: {
      get_store: {
        resultCode: -1112,
        message: "Unable to get stores",
      },
    
      token_error: {
        resultCode: -1212,
        message: "Authentication failed; Bad JWT token",
        message1: "Invalid Store ID",
        message2: "Category is not available",
      },
    },
  },
  token_error: {
    resultCode: -1031,
    responseCode: 400,
    message: "Authentication failed",
    message1: "Authentication Token or Merchant_id and Store ID are required",

  },


  payment_status: {
    resultCode: -1031,
    message: "order_id is required",
  },


  terminal_reset: {
    success: {
      resultCode: 1311,
      message: "Terminal Reset Successfully"

    },
    error: {
      resultCode: -1311,
      message: "Unable to reset the terminal"
    },
    request_body: {
      resultCode: -1311,
      errors: {
        error: "terminal_id is required"
      }
    }
  },

  paymeny_refund: {
    success: {
      resultCode: 1311,
      message: "Payment refunded Successfully"

    },
    error: {
      resultCode: -1311,
      message: "Failed to refund",
      message1: "Unable to get store",
      message2: "Unable to get order"
    },
    request_body: {
      resultCode: -1311,
      errors: {
        error: "transactionId is required",
        error2: "store_id is required",

      }
    }
  },


  order_cancel: {
    success: {
      resultCode: 1031,
      message: "Order cancelled successfully",

    },
    error: {
      resultCode: -1031,
      message: "Unable to cancel the order",
      message2: "Unable to get order",

    },
    request_body: {
      resultCode: -1031,
      errors: {
        error: "order_id is required",
      }
    }
  },

  create_code: {
    success: {
      resultCode: 1031,
      message: "Successfully created code",
    },
    error: {
      resultCode: -1031,
      message: "Unable to created code",
      message1: "Already exists Mac Address"
    },
    request_body: {
      errors: {
        error: "mac_address is required",
        error2: "merchant_id is required",
      },
    },
  },
  get_code: {
    success: {
      resultCode: 1031,
      message: "Successfully get code",
    },
    error: {
      resultCode: -1031,
      message: "Unable to get code",
    },
    request_body: {
      error: "mac_address is required"
    }
  },

  
};
