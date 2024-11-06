exports.Json = {
  merchant: {
    success: {
      merchant_login: {
        resultCode: 1411,
        message: "OTP send successfully",
        message1: "Resend OTP sent successfully",
      },
      verify_otp: {
        resultCode: 1411,
        message: "Successfully get merchant",
      },
      clerk_login: {
        resultCode: 1412,
        message: "Successfully get clerk",
      },
    },
    error: {
      merchant_login: {
        resultCode: -1411,
        message: "Unable to get merchant",
        message1: "Invalid Merchant Phone Number",

      },
      verify_otp: {
        resultCode: -1411,
        // message: "Invalid OTP",
        message: "Authentication failed; Bad JWT token",
      },
      clerk_login: {
        resultCode: -1412,
        message: "Unable to get merchant",
        message1: "Invalid clerk",
        message2: "Unable to get clerk",
        message3: "Unable to get store",
        message4: "Device is not available in store app",
      },
    },
    request_body: {
      login_merchant: {
        resultCode: -1411,
        errors: {
          error: "Merchant Phone is required",
        },
      },
      verify_otp: {
        resultCode: -1411,
        errors: {
          error: "OTP is required",
          error2: "Type is required",
          error3: "mac_address is required",

        },
      },
      clerk_login: {
        resultCode: -1412,
        errors: {
          error: "Clerk password is required",
        },
      },
    },
  },
  orders: {
    success: {
      get_opened: {
        resultCode: 1421,
        message: "Successfully get opened order",
      },
      get_closed: {
        resultCode: 1433,
        message: "Successfully get closed orders",
      },
      update_order: {
        resultCode: 1422,
        message: "Successfully update order",
      },
      close_orders: {
        resultCode: 1421,
        message: "Successfully closed daybefore opened order",
      },
      recall: {
        resultCode: 1422,
        message: "Successfully updated recall order",
      },
      bump: {
        resultCode: 1422,
        message: "Successfully changed front",
      },
    },
    error: {
      get_opened: {
        resultCode: -1421,
        message: "Unable to get open order",
        message1: "Invalid store ID",
        message2: "Invalid merchant ID",
      },

      get_closed: {
        resultCode: -1433,
        message: "Unable to get closed order",
        message1: "Invalid Store ID",
        message2: "Invalid merchant ID",

      },
      update_order: {
        resultCode: -1422,
        message: "Unable to update order",
        message1: "Order is not available",
        message2: "item is not available"

      },
      recall: {
        resultCode: -1422,
        message: "Unable to update recall",
        message1: "Order is not available",
        message2: "store is not available"
      },
      bump: {
        resultCode: -1422,
        message: "Unable to change bump state",
        message1: "Order is not available",
        message2: "store is not available"
      },
      close_orders: {
        resultCode: -1421,
        message: "Unable to cancel daybefore open order",
        message1: "Invalid store ID",
        message2: "Invalid merchant ID",
      },
      token_error: {
        resultCode: -1212,
        message: "Authentication failed; Bad JWT token",
        message1: "Invalid Store ID",
        message2: "Category is not available",
      },
    },
    request_body: {
      update_order: {
        resultCode: -1422,
        errors: {
          error: "order_id is required",
          error2: "date is required",
          error3: "type is required",
          error4: "store_id is required",

        },
      },
      recall: {
        resultCode: -1422,
        errors: {
          error: "order_id is required",
          error2: "date is required",
          error4: "store_id is required",

        },
      },
      bump: {
        resultCode: -1422,
        errors: {
          error: "order_id is required",
          error2: "date is required",
          error4: "store_id is required",

        },
      }
    },
  },
  token_error: {
    resultCode: -1031,
    responseCode: 400,
    message: "Authentication failed",
    message1: "Authentication Token or Merchant_id and Store ID are required",
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
        resultCode: -1112,
        message: "Authentication failed; Bad JWT token",
        message1: "Invalid Store ID",
        message2: "Category is not available",
      },
    },
  },      
  default: {
    resultCode: -1101,
    errors: {
      error: "merchant_id is required",
      error2: "store_id is required",
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
        error1: "merchant_id is required",

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
      error: "code is required"
    }
  },
};
