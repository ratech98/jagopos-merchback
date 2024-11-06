//merchant translate

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
      update_merchant: {
        resultCode: 1031,
        message: "Successfully updated merchant",
      },
      login_merchant: {
        resultCode: 1101,
        message: "OTP sende successfully",
        message1: "Resend Otp sended successfully",
      },
      verify_otp: {
        resultCode: 1101,
        message: "Successfully verified otp",
      },
    },
    error: {
      add_merchant: {
        resultCode: -1021,
        message: "Unable to register Business ",
      },
      get_merchant: {
        resultCode: -1021,
        message: "Unable to get Business Details ",
        message2: "Authentication failed; Bad JWT token",
      },

      update_merchant: {
        resultCode: -1031,
        message: "Unable to Update Business Details",
      },
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
      login_merchant: {
        resultCode: 1101,
        errors: {
          error: "Merchant ID is required",
        },
      },
      verify_otp: {
        resultCode: 1101,
        errors: {
          error: "otp is required",
          error2: "Type is required",
        },
      },
      add_merchant: {
        resultCode: 1021,
        errors: {
          error: "Merchant Name is required",
          error2: "Merchant Phone number is required",
          error3: "Merchant Street is required",
          error4: "Merchant City is required",
          error5: "Merchant State is required",
          error6: "Merchant Zip Code is required",
          error7: "Contact Name is required",
          error8: "Contact Phone number is required",
          error9: "Contact Street is required",
          error10: "Contact City is required",
          error11: "Contact State is required",
          error12: "Contact Zip Code is required",
          error13: "Price  is required",
          error14: "Add Method is required",
        },
      },
      update_merchant: {
        resultCode: 1031,
        errors: {
          error: "Contact Name is required",
          error2: "Contact Phone number is required",
          error3: "Contact Street is required",
          error4: "Contact City is required",
          error5: "Contact State is required",
          error6: "Contact Zip Code is required",
        },
      },
    },
  },
  store: {
    success: {
      add_store: {
        resultCode: 1121,
        message: "Successfully created store",
      },
      get_store: {
        resultCode: 1112,
        message: "Successfully get store",
      },
      update_store: {
        resultCode: 1131,
        message: "Successfully updated store",
      },
      delete_store: {
        resultCode: 1141,
        message: "Successfully deleted store",
      },
      get_all_stores: {
        resultCode: 1112,
        message: "Successfully get stores",
      },
    },
    error: {
      add_store: {
        resultCode: -1121,
        message: "Unable to add Store",
      },
      get_store: {
        resultCode: -1112,
        message: "Unable to get Store",
        message1: "Store not found",
      },
      update_store: {
        resultCode: -1131,
        message: "Unable to update Store",
        message1: "Unable to get Store",
      },
      delete_store: {
        resultCode: -1141,
        message: "Unable to delete Store",
      },
      token_error: {
        resultCode: -1141,
        message: "Authentication failed; Bad JWT token",
      },
      get_all_stores: {
        resultCode: -1112,
        message: "Unable to get Store",
        message1: "Store not found",
      },
    },
    request_body: {
      add_store: {
        resultCode: 1121,
        errors: {
          error: "Merchant ID is required",
          error2: "Store Name is required",
          error3: "Store Phone is required",
          error4: "Store Street is required",
          error5: "Store City is required",
          error6: "Store State is required",
          error7: "Store Zip Code is required",
        },
      },
      get_store: {
        resultCode: 1112,
        errors: {
          error: "Store ID is required",
        },
      },
      update_store: {
        resultCode: 1131,
        errors: {
          error: "Store ID is required",
          error2: "Store Name is required",
          error3: "Store Phone is required",
          error4: "Store Street is required",
          error5: "Store City is required",
          error6: "Store State is required",
          error7: "Store Zip Code is required",
        },
      },
      delete_store: {
        resultCode: 1141,
        errors: {
          error: "Store ID is required",
        },
      },
    },
  },
  category: {
    success: {
      add_category: {
        resultCode: 1221,
        message: "Successfully created category",
      },
      get_categories: {
        resultCode: 1212,
        message: "Successfully get categories",
      },
      get_particular_category: {
        resultCode: 1212,
        message: "Successfully get category",
      },
      update_category: {
        resultCode: 1231,
        message: "Successfully updated category",
      },
      delete_category: {
        resultCode: 1241,
        message: "Successfully deleted category",
      },
    },
    error: {
      add_category: {
        resultCode: -1221,
        message: "Unable to add category",
      },
      get_categories: {
        resultCode: -1212,
        message: "Unable to get category",
      },
      update_category: {
        resultCode: -1231,
        message: "Unable to update category",
        message1: "Invalid category ID",
      },
      delete_category: {
        resultCode: -1241,
        message: "Unable to delete category",
        message1: "Category ID is invalid",
      },
      get_particular_category: {
        resultCode: -1212,
        message: "Unable to get specific category",
      },
      token_error: {
        resultCode: -1212,
        message: "Authentication failed; Bad JWT token",
        message1: "Store is not available",
      },
    },
    request_body: {
      add_category: {
        resultCode: 1221,
        errors: {
          error: "Store ID is required",
          error2: "Category image is required",
          error3: "Category name is required",
          error4: "Merchant ID is required",
        },
      },
      get_categories: {
        resultCode: 1212,
        errors: {
          error: "Store ID is required",
        },
      },
      get_particular_category: {
        resultCode: 1212,
        errors: {
          error: "Store ID is required",
          error2: "Category ID is required",
        },
      },
      update_category: {
        resultCode: 1231,
        errors: {
          error: "Category ID is required",
          error2: "Category image is required",
          error3: "Category name is required",
        },
      },
      delete_category: {
        resultCode: 1241,
        errors: {
          error: "Category ID is required",
        },
      },
    },
  },
  item: {
    success: {
      add_item: {
        resultCode: 1222,
        message: "Successfully created item",
      },
      get_items: {
        resultCode: 1213,
        message: "Successfully get items",
      },
      get_particular_item: {
        resultCode: 1213,
        message: "Successfully get particular item",
      },
      update_item: {
        resultCode: 1232,
        message: "Successfully updated item",
      },
      delete_item: {
        resultCode: 1242,
        message: "Successfully deleted item",
      },
      available_category_items: {
        resultCode: 1214,
        message: "Successfully get items by category",
      },
      status_change: {
        resultCode: 1232,
        message: "Successfully change status",
      },
    },
    error: {
      add_item: {
        resultCode: -1222,
        message: "Unable to add item",
        message1: "Invalid category ID",
      },
      get_items: {
        resultCode: -1213,
        message: "Unable to get item",
      },
      update_item: {
        resultCode: -1232,
        message: "Unable to update item",
        message1: "Invalid item ID",
      },
      delete_item: {
        resultCode: -1242,
        message: "Unable to delete item",
        message1: "Invalid item ID",
      },
      get_particular_item: {
        resultCode: -1213,
        message: "Unable to get specific item",
      },
      available_category_items: {
        resultCode: -1214,
        message: "Unable to get available category items",
      },
      token_error: {
        resultCode: -1212,
        message: "Authentication failed; Bad JWT token",
        message1: "Store is not available",
      },
      status_change: {
        resultCode: -1232,
        message: "Invalid item ID",
      },
    },
    request_body: {
      add_item: {
        resultCode: 1221,
        errors: {
          error: "Category ID is required",
          error2: "Item Name is required",
          error3: "Item Image is required",
          error4: "Item Price is required",
          error5: "Item Description is required",
          error6: "Item SubItem is required",
          error7: "Store ID is required",
          error8: "Merchant ID is required",
        },
      },
      get_items: {
        resultCode: 1212,
        errors: {
          error: "Merchant ID is required",
          error2: "Category ID is required",
          error3: "Store ID is required",
        },
      },
      get_particular_item: {
        resultCode: 1212,
        errors: {
          error: "Item ID is required",
        },
      },
      update_item: {
        resultCode: 1231,
        errors: {
          error: "Item ID is required",
          error2: "Item Name is required",
          error3: "Item Image is required",
          error4: "Item Price is required",
          error5: "Item Description is required",
          error6: "Item SubItem is required",
        },
      },
      delete_item: {
        resultCode: 1241,
        errors: {
          error: "Item ID is required",
        },
      },
      available_category_items: {
        resultCode: 1241,
        errors: {
          error: "Merchant ID is required",
          error1: "Store ID is required",
        },
      },
    },
  },
  clerk: {
    success: {
      add_clerk: {
        resultCode: 1223,
        message: "Successfully created clerk",
      },
      get_clerks: {
        resultCode: 1215,
        message: "Successfully get clerks",
      },
      get_clerk: {
        resultCode: 1215,
        message: "Successfully get clerk",
      },
      update_clerk: {
        resultCode: 1233,
        message: "Successfully updated clerk",
      },
      delete_clerk: {
        resultCode: 1243,
        message: "Successfully deleted clerk",
      },
      status_change: {
        resultCode: 1212,
        message: "Succesfully changed",
      },
    },
    error: {
      add_clerk: {
        resultCode: -1223,
        message: "Unable to add clerk",
      },
      get_clerks: {
        resultCode: -1215,
        message: "Unable to add clerks",
      },
      get_clerk: {
        resultCode: -1215,
        message: "Unable to get clerk",
        message1: "Invalid clerk ID",
      },
      update_clerk: {
        resultCode: -1233,
        message: "Unable to update clerk",
        message1: "Invalid clerk ID",
      },
      delete_clerk: {
        resultCode: -1243,
        message: "Unable to update clerk",
        message1: "Invalid clerk ID",
      },
      token_error: {
        resultCode: -1212,
        message: "Authentication failed; Bad JWT token",
      },
      status_change: {
        resultCode: -1212,
        message: "Invalid clerk ID",
      },
    },
    request_body: {
      add_clerk: {
        resultCode: 1221,
        errors: {
          error: "Merchant ID is required",
          error2: "Clerk Name is required",
          error3: "Clerk ID is required",
          error4: "Clerk Pin is required",
          error5: "Store ID is required",
        },
      },
      get_clerks: {
        resultCode: 1212,
        errors: {
          error: "Store ID is required",
        },
      },
      get_clerk: {
        resultCode: 1212,
        errors: {
          error: "Clerk ID is required",
        },
      },
      update_clerk: {
        resultCode: 1231,
        errors: {
          error: "Clerk ID is required",
          error2: "Clerk Name is required",
          error3: "Clerk Image is required",
          error4: "Clerk Pin is required",
        },
      },
      delete_clerk: {
        resultCode: 1241,
        errors: {
          error: "Clerk ID is required",
        },
      },
    },
  },
  bulk_upload: {
    success: {
      uploaded: {
        resultCode: 1021,
        message: "Successfully created Categoy and Item",
      },
      removeAll: {
        resultCode: 1021,
        message: "Successfully removed Categoy and Item",
      },
      bulkImageUpload: {
        resultCode: 1021,
        message: "Successfully updated Item image",
      },
    },
    error: {
      uploaded: {
        resultCode: -1021,
        message: "Unable to created Categoy and Item",
      },
      token: {
        resultCode: -1021,
        message: "Invalid Merchant ID",
      },
      store: {
        resultCode: -1021,
        message: "Invalid Store ID",
      },
      removeAll: {
        resultCode: -1021,
        message: "Unable to removed Categoy and Item",
      },
      bulkImageUpload: {
        resultCode: 1021,
        message: "Unable to updated Item image",
        message2: "Invalid Item",
        message3: "Invalid Category",
      },
    },
    request_body: {
      uploaded: {
        resultCode: -1101,
        errors: {
          error: "item_name is required",
          error2: "item_price is required",
          error3: "item_description is required",
          error4: "category is required",
          error5: "store_id is required",
        },
      },
      removeAll: {
        resultCode: -1101,
        errors: {
          error: "store_id is required",
        },
      },
      bulkImageUpload: {
        resultCode: -1101,
        errors: {
          error: "category is required",
          error2: "store_id is required",
          error3: "item_name is required",
        },
      },
    },
  },
  orders: {
    success: {
      get_orders: {
        resultCode: 1211,
        message: "Successfully get orders",
      },
    },
    error: {
      get_orders: {
        resultCode: -1211,
        message: "Unable to get orders",
      },
      get_stores: {
        resultCode: -1211,
        message: "Unable to get store",
      },
    },
    request_body: {
      get_orders: {
        resultCode: -1211,
        errors: {
          error: "store_id is required",
        },
      },
    },
  },

  cancel_orders: {
    success: {
      get_order: {
        resultCode: 1211,
        message: "Successfully cancelled order",
      },
    },
    error: {
      get_order: {
        resultCode: -1211,
        message: "Unable to cancelled order",
      },
      get_order: {
        resultCode: -1211,
        message: "Unable to get order",
      },
    },
    request_body: {
      get_orders: {
        resultCode: -1211,
        errors: {
          error: "order_id is required",
        },
      },
    },
  },

  complete_order: {
    success: {
      get_order: {
        resultCode: 1211,
        message: "Successfully completed order",
      },
    },
    error: {
      get_order: {
        resultCode: -1211,
        message: "Unable to completed order",
        message2: "Unable to get order",
      },
    },
    request_body: {
      get_orders: {
        resultCode: -1211,
        errors: {
          error: "order_id is required",
        },
      },
    },
  },

  cerate_device: {
    pos: {
      success: {
        resultCode: 1211,
        message: "Successfully created pos devices",
      },
      error: {
        resultCode: -1211,
        message: "Unable to created pos devices",
        message1: "Invalid store ID",
        message2: "Invalid Code",
        message3: "Already exists mac_address",
        message4: "Already exists device serial number",
        message5: "Invalid device serial number",
      },
      request_body: {
        resultCode: -1211,
        errors: {
          error: "device_type is required",
          error2: "device_name is required",
          error3: "store_id is required",
          error4: "device_code is required",
          error5: "device_serial_no is required",
        },
      },
    },
    kds: {
      success: {
        resultCode: 1211,
        message: "Successfully created kds devices",
      },
      error: {
        resultCode: -1211,
        message: "Unable to created kds devices",
        message1: "Invalid store ID",
        message2: "Invalid Code",
        message3: "Already exists mac_address",
      },
      request_body: {
        resultCode: -1211,
        errors: {
          error: "device_type is required",
          error2: "device_name is required",
          error3: "store_id is required",
          error4: "device_code is required",
        },
      },
    },
    token: {
      success: {
        resultCode: 1211,
        message: "Successfully created token devices",
      },
      error: {
        resultCode: -1211,
        message: "Unable to created token devices",
        message1: "Invalid store ID",
        message2: "Invalid Code",
        message3: "Already exists mac_address",
      },
      request_body: {
        resultCode: -1211,
        errors: {
          error: "device_type is required",
          error2: "device_name is required",
          error3: "store_id is required",
          error4: "device_code is required",
        },
      },
    },
  },

  get_devices: {
    success: {
      resultCode: 1211,
      message: "Successfully get devices",
    },
    error: {
      resultCode: -1211,
      message: "Unable to get devices",
      message1: "Invalid store ID",
    },
    request_body: {
      resultCode: -1211,
      errors: {
        error: "device_type is required",
        error2: "store_id is required",
      },
    },
  },

  delete_device: {
    success: {
      resultCode: 1211,
      message: "Successfully deleted device",
    },
    error: {
      resultCode: -1211,
      message: "Unable to deleted device",
      message1: "Invalid device ID",
    },
    request_body: {
      resultCode: -1211,
      errors: {
        error: "device_id is required",
      },
    },
  },
};
