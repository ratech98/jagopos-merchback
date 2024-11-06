//admin translate

exports.Json = {
  merchant: {
    success: {
      add_merchant: {
        resultCode: 1021,
        message: "Successfully created merchant",
      },
      get_merchant: {
        resultCode: 1021,
        message: "Successfully get merchant",
      },
      all_merchant: {
        resultCode: 1021,
        message: "Successfully get merchant",
      },
      update_merchant: {
        resultCode: 1031,
        message: "Successfully updated merchant",
      },
      delete_merchant: {
        resultCode: 1041,
        message: "Successfully deleted merchant",
      },
      merchant_token: {
        resultCode: 1021,
        message: "Successfully generated token",
      }
    },
    error: {
      add_merchant: {
        resultCode: -1021,
        message: "Unable to register Business ",
      },
      get_merchant: {
        resultCode: -1021,
        message: "Unable to get Business Details ",
      },
      all_merchant: {
        resultCode: -1021,
        message: "Unable to get Business Details ",
      },
      update_merchant: {
        resultCode: -1031,
        message: "Unable to Update Business Details Invalid Merchant ID",
        message1: "Invalid Merchant ID",

      },
      login_merchant: {
        resultCode: -1031,
        message: "Merchant ID is invalid",
      },
      verify_otp: {
        resultCode: -1031,
        message: "Invalid OTP",
      },
      delete_merchant: {
        resultCode: -1041,
        message: "Unable to deleted merchant",
        message1: "Invalid Merchant ID",
      },
      token_merchant: {
        resultCode: 1021,
        message: "Invalid merchant ID",
      }
    },
    request_body: {
      add_merchant: {
        resultCode: 1021,
        errors: {
          error: "Merchant Name is required",
          error2: "Merchant Phone number is required",
          error3: "Merchant Street is required",
          error4: "Merchant City is required",
          error5: "Merchant State  is required",
          error6: "Merchant Zip Code  is required",
          error7: "Contact Name  is required",
          error8: "Contact Phone number is required",
          error9: "Contact Street is required",
          error10: "Contact City is required",
          error11: "Contact State is required",
          error12: "Contact Zip Code is required",
          error13: "Price is required",
          error14: "Add Method is required",



        },
      },
      get_merchant: {
        resultCode: 1021,
        errors: {
          error: "Merchant ID is required",
        },
      },
      update_merchant: {
        resultCode: 1031,
        errors: {
          error: "Merchant ID is required",
          error2: "Merchant Name is required",
          error3: "Merchant Phonenumber is required",
          error4: "Merchant Street is required",
          error5: "Merchant City  is required",
          error6: "Merchant State  is required",
          error7: "Merchant Zip Code  is required",
          error8: "Contact Name  is required",
          error9: "Contact Phone number  is required",
          error10: "Contact Street  is required",
          error11: "Contact City  is required",
          error12: "Contact State  is required",
          error13: "Contact Zip Code  is required",
          error14: "Pricing is required",


        },
      },
      delete_merchant: {
        resultCode: 1041,
        errors: {
          error: "Merchant ID is required",
        },
      },
      merchant_token: {
        resultCode: 1101,
        errors: {
          error: "Merchant ID is required",
        }
      }
    },
  },
  admin: {
    success: {
      login_admin: {
        resultCode: 1021,
        message: "OTP send successfully",
        message1: "Resend OTP send successfully"
      },
      verify_admin: {
        resultCode: 1021,
        message: "Successfully verified admin",
      },
      get_admin: {
        resultCode: 1021,
        message: "Successfully get admin details",
      },
    },
    error: {
      login_admin: {
        resultCode: -1021,
        message: "Invalid admin ID",
      },
      verify_admin: {
        resultCode: -1021,
        message: "Invalid OTP",
      },
      token_error: {
        resultCode: -1021,
        message: "Authentication failed; Bad JWT token",
      },
      add_admin: {
        resultCode: -1021,
        message: "Unable to add admin",
      },
      get_admin: {
        resultCode: -1021,
        message: "Unable to get admin details",
      },
    },
    request_body: {
      login_admin: {
        resultCode: 1021,
        errors: {
          error: "Admin phone number is required",
          error2: "otp_token is required"
        },
      },
      verify_admin: {
        resultCode: 1021,
        errors: {
          error: "otp is required",
          error1: "Type is required",
        },
      },
    },
  },
  token_error: {
    resultCode:-1031,
    responseCode: 400,
    message: "Authentication failed; Bad JWT token",
    message1: "Device is removed in store app",

  },

  get_domain: {
    success: {},
    error:{}

  },

  add_domain: {
    success: { resultCode: 1311, message: "Successfully added url" },
    error: { resultCode: -1311, message: "Undable to add domain" },
    request_body: {
      errors: {
        error: "Domain is required",
        error2: "Domain must be a valid URL",
      },
    },
  },
  get_domain: {
    success: { resultCode: 1311, message: "Successfully added url" },
    error: { resultCode: -1311, message: "Undable to add domain" },
  },

  add_url: {
    errors: {
      "domain-required": "Domain URL is require",
      "url-validation": "Enter valid URL",
    },
  },
};
