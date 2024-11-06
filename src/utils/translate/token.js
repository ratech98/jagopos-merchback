exports.Json = {
  token_app_login: {
    success: {
      login_merchant: {
        resultCode: 1101,
        message: "OTP send successfully",
        message1: "Resend OTP send  successfully",
      },
      verify_otp: {
        resultCode: 1101,
        message: "Successfully verified otp",
      },
    },
    error: {
      login_merchant: {
        resultCode: -1031,
        message: "Merchant number is invalid",
      },
      verify_otp: {
        resultCode: -1031,
        message: "Invalid OTP",
      },
    },
    request_body: {
      errors: {
        error: "Merchant number is required",
        error2: "OTP is required",
        error3: "Type is required",
      },
    },
  },

  store: {
    success: {
      get_all_stores: {
        resultCode: 1112,
        message: "Successfully get stores",
      },
    },
    error: {
      get_all_stores: {
        resultCode: -1112,
        message: "Unable to get Store",
      },
    },
    request_body: {},
  },

  set_close_time: {
    success: {
      resultCode: 1112,
      message: "Successfully updated store time",
    },
    error: {
      resultCode: -1112,
      message: "Unable to updated close time",
    },
    request_body: {
      errors: {
        error: "store_id is required",
        error2: "open_time is required",
        error3: "close_time is required",

      },
    },
  },

  tv: {
    success: {
      create: {
        resultCode: 1121,
        message: "Successfully created TV",
      },
      get_tv: {
        resultCode: 1121,
        message: "Successfully get TV",
      },
      update_tv: {
        resultCode: 1131,
        message: "Successfully updated TV",
      },
    },
    error: {
      create: {
        resultCode: -1121,
        message: "Invalid Code",
      },

      get_tv: {
        resultCode: -1121,
        message: "Unable to get devices",
      },

      update_tv: {
        resultCode: -1131,
        message: "Unable to updated TV",
        message1: "Unable to get device",
        message2: "Invalid Code",
        message3: "Invalid TV ID",
        message4: "Already exists POS name",
        message5: "Already exists TV name",
        message6: "Already exists IMEI number",
        message7: "Terminal is Offline",
        message8: "Already exists Terminal Serial Number",
        message9: "Invalid Terminal Serial Number",
      },

      get_store: {
        resultCode: -1112,
        message: "Unable to get Store",
      },
    },
    request_body: {
      create: {
        errors: {
          error: "Store ID is required",
          error2: "Name is required",
          error3: "Code is required",
          error4: "mac_address is required",
        },
      },
      get_tv: {
        errors: {
          error: "Store ID is required",
        },
      },

      update_tv: {
        errors: {
          error: "Store ID is required",
          error2: "Tv ID is required",
          error3: "Code is required",
        },
      },
    },
  },

  create_token: {
    success: {
      create_token: {
        resultCode: 1141,
        message: "Successfully created token",
      },
    },
    error: {
      create_token: {
        resultCode: -1141,
        message: "Unable to created token",
        message1: "Already exists mac_address",
      },
    },
  },

  get_orders: {
    success: {
      get_orders: {
        resultCode: 1151,
        message: "Successfully get orders",
      },
    },
    error: {
      get_orders: {
        resultCode: -1151,
        message: "Unable to get orders",
        message1: "Unable to get store",
        message2: "Unable to get TV",
      },
    },
  },

  disconnect_tv: {
    success: {
      disconnect_tv: {
        resultCode: 1161,
        message: "Successfully disconnected TV",
        message1: "Successfully disconnected POS",
      },
    },
    error: {
      disconnect_tv: {
        resultCode: -1161,
        message: "Unable to disconnected TV",
        message2: "Unable to get device",
        message3: "Invalid TV ID",
        message4: "Unable to disconnected POS",
      },
    },

    request_body: {
      disconnect_tv: {
        errors: {
          error: "Store ID is required",
          error2: "TV ID is required",
        },
      },
    },
  },

  get_code: {
    success: {
      get_code: {
        resultCode: 1171,
        message: "Successfully get device",
      },
    },
    error: {
      get_code: {
        resultCode: -1171,
        message: "Unable to get device",
      },
    },
  },
  remove_code: {
    success: {
      remove_code: {
        resultCode: 1181,
        message: "Successfully removed code",
      },
    },
    error: {
      remove_code: {
        resultCode: -1181,
        message: "Unable to remove code",
      },
    },
    request_body: {
      errors: {
        error: "mac_address is required",
        error1: "type is required",
      },
    },
  },

  check_code: {
    success: {
      resultCode: 1181,
      message: "Successfully get code",
    },
    error: {
      resultCode: -1181,
      message: "Invalid code",
    },
    request_body: {
      errors: {
        error: "code is required",
        error1: "type is required",
      },
    },
  },

  enable_service: {
    success: {
      remove_code: {
        resultCode: 1181,
        message: "Successfully updated tv",
      },
    },
    error: {
      remove_code: {
        resultCode: -1181,
        message: "Unable to updated tv",
      },
    },
    request_body: {
      errors: {
        error: "store_id is required",
        error2: "tv_id is required",
        error3: "show_name is required",
        error4: "token_announcement is required",
        error5: "layout is required",
      },
    },
  },

  get_merchant: {
    success: {
      resultCode: 1112,
      message: "Successfully get the merchant",
    },
    error: {
      resultCode: -1112,
      message: "Unable to get merchant",
    },
  },

  create_pos: {
    success: {
      resultCode: 1112,
    },
    error: {
      resultCode: -1112,
    },
    request_body: {
      resultCode: -1112,
      errors: {
        error: "name is required",
        error2: "store_id is required",
        error3: "code is required",
        error4: "type is required",
        error5: "mac_address is required",
        error6: "serial_no is required",
      },
    },
  },

  get_pos: {
    success: {
      resultCode: 1112,
      message: "Successfully get pos",
    },
    error: {
      resultCode: -1112,
      message: "Unable to get pos",
    },
    request_body: {
      errors: {
        error: "store_id is required",
        error1: "type is required",
      },
    },
  },
  disconnect_pos: {
    success: { resultCode: 1112, message: "Successfully disconnected pos" },
    error: { resultCode: -1112, message: "Unable disconnect pos" },
    request_body: {
      errors: {
        error: "device_id is required",
      },
    },
  },

  create_code: {
    success: {
      resultCode: 1112,
      message: "Successfully created code",
    },
    error: {
      resultCode: -1112,
      message: "Unable to create code",
    },
    request_body: {
      errors: {
        error: "mac_address is required",
        error1: "type is required",
      },
    },
  },

  terminal_status: {
    success: {
      resultCode: 1112,
      message: "Successfully get terminal status",
    },
    error: {
      resultCode: -1112,
      message: "Unable to get terminal status",
      message1: "Invalid terminal ID",
    },
    request_body: {
      errors: {
        error: "terminal_id is required",
      },
    },
  },

  update_device: {
    success: {
      resultCode: 1112,
      message: "Successfully updated device",
    },
    error: {
      resultCode: -1112,
      message: "Unable to updated",
      message1: "Unable to get device",
      message2: "Already exists Terminal Serial Number",
      message3: "Invalid Terminal Serial Number"
    },
    request_body: {
      errors: {
        error: "device_id is required",
        error1: "serial_no is required",
      },
    },
  },
};
