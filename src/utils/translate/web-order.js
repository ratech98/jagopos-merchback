exports.Json = {
  getsoreItems: {
    success: {
      getItems: {
        resultCode: 1311,
        message: "Successfully get store data",
      },
    },
    error: {
      getItems: {
        resultCode: -1212,
        message: "Unable to get store data",
        message1: "Unable to get store data",
      },
    },
    request_body: {
      getItems: {
        resultCode: -1311,
        errors: {
          error: "Merchant Phone is required",
        },
      },
    },
  },

  create_order: {
    success: {
      create: {
        resultCode: 1321,
        message: "Successfully create order",
      },
    },
    error: {
      create: {
        resultCode: -1321,
        message: "Unable to create order",
        message1: "Payment Declined",
        message2: "Unable to connect to Payment gateway Card is not charged",
        message3: "Message format error",
        message4: "Card is not charged"

      },
      merchant: {
        resultCode: -1321,
        message: "Unable to get Merchant",
      },
      store: {
        resultCode: -1321,
        message: "Unable to get Store",
      },

      items: {
        resultCode: -1321,
        message: "Unable to get item",
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
          error14: "phone number is required",
          error15: "sub_total is required",
          error16: "tax is required",
          error17: "total_price is required",
          error18: "merchant_name is required",
          error19: "enter valid phone number",
          error20: "delivery_type is required",
          error21: "line1 is required",
          error22: "postalCode is required",
          error23: "accountNumber is required",
          error24: "securityCode is required",
          error25: "expirationMonth is required",
          error26: "expirationYear is required",

        },
      },
    },
  },

  generate_token: {
    success: {
      generateToken: {
        resultCode: 1101,
        message: "Successfully generated token",
      },
    },
  },
  token_error: {
    resultCode: -1031,
    responseCode: 400,
    message: "Authentication failed; Bad JWT token",
  },

  getmerchants: {
    success: { resultCode: 1311, message: "Successfully get merchants" },
    error: { resultCode: -1311, message: "Unable to get merchants" },
  },

  getstores: {
    success: { resultCode: 1311, message: "Successfully get stores" },
    error: { resultCode: -1311, message: "Unable to get stores" },
  },

  web_order_payment: {
    success: {
        resultCode: 1321,
        message: "Successfully payment paid"
    },
    error: {
      resultCode: 1321,
        message: "Payment failed"
    },
    request_body: {
      payment: {
        resultCode: -1321,
        errors: {
          error: "amount is required",
          error2: "city is required",
          error3: "line1 is required",
          error4: "postalCode is required",
          error5: "firstName is required",
          error6: "lastName is required",
          error7: "companyName is required",
          error8: "email is required",
          error9: "mobileNumber is required",
          error10: "accountNumber is required",
          error11: "securityCode is required",
          error12: "expirationMonth is required",
          error13: "expirationYear is required",
          error14: "referenceId is required",
          error15: "countryId is required",
          error16: "stateId is required",
          amount: "Amount must be positive"

        },
      },
    },
  },

  refundPayment: {
    success: {
        resultCode: 1321,
        message: "Successfully refund payment",
        message1: "Payment already refunded", 
    },
    error: {
      resultCode: -1321,
        message: "Failed to refund",
        message2: "Unable to get Merchant",
        message3: "Unable to get Store",
        message4: "Unable to get Order"


    },
    request_body: {
      errors: {
        error: "transactionId is required",
        error2: "merchant_name is required",
        error3: "store_name is required"

      }
    }

  },

 
};
