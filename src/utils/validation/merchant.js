//merchant validation

const yup = require("yup");

//Translate
const { Json } = require("../translate/merchant");

const isImageFile = (value) => {
  if (value && typeof value === "object") {
    const fileType = value.type.split("/")[0];
    return fileType === "image";
  }
  return true;
};

const isURL = (value) => {
  if (typeof value === "string") {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(value);
  }
  return false;
};

//Login Schema
exports.LoginSchema = yup.object().shape({
  merchant_phone: yup
    .string("")
    .required(Json.merchant.request_body.login_merchant.errors.error),
});

exports.VerifyOtpSchema = yup.object().shape({
  otp: yup
    .string("")
    .required(Json.merchant.request_body.verify_otp.errors.error),
  type: yup
    .string("")
    .required(Json.merchant.request_body.verify_otp.errors.error2),
});

//Merchant Schema
exports.AddMerchantSchema = yup.object().shape({
  merchant_name: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error),
  merchant_phone_number: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error2),
  merchant_street: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error3),
  merchant_city: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error4),
  merchant_state: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error5),
  merchant_zip_code: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error6),

  contact_name: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error7),
  contact_phone_number: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error8),
  contact_street: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error9),
  contact_city: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error10),
  contact_state: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error11),
  contact_zip_code: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error12),
  pricing: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error12),
  add_method: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error14),
});

exports.UpdateMerchantSchema = yup.object().shape({
  contact_name: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error),
  contact_phone_number: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error2),
  contact_street: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error3),
  contact_city: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error4),
  contact_state: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error5),
  contact_zip_code: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error6),
  full_logo: yup.string("").optional(),
  small_logo: yup.string("").optional(),
});

//Store Schema
exports.AddStoreSchema = yup.object().shape({
  store_name: yup
    .string("")
    .required(Json.store.request_body.add_store.errors.error2),
  store_phone: yup
    .string("")
    .required(Json.store.request_body.add_store.errors.error3),
  store_street: yup
    .string("")
    .required(Json.store.request_body.add_store.errors.error4),
  store_city: yup
    .string("")
    .required(Json.store.request_body.add_store.errors.error5),
  store_state: yup
    .string("")
    .required(Json.store.request_body.add_store.errors.error6),
  store_zip_code: yup
    .string("")
    .required(Json.store.request_body.add_store.errors.error7),
});

exports.GetStoreSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.store.request_body.get_store.errors.error),
});

exports.UpdateStoreSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.store.request_body.update_store.errors.error),
  store_name: yup
    .string("")
    .required(Json.store.request_body.update_store.errors.error2),
  store_phone: yup
    .string("")
    .required(Json.store.request_body.update_store.errors.error3),
  store_street: yup
    .string("")
    .required(Json.store.request_body.update_store.errors.error4),
  store_city: yup
    .string("")
    .required(Json.store.request_body.update_store.errors.error5),
  store_state: yup
    .string("")
    .required(Json.store.request_body.update_store.errors.error6),
  store_zip_code: yup
    .string("")
    .required(Json.store.request_body.update_store.errors.error7),
});

exports.DeleteStoreSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.store.request_body.delete_store.errors.error),
});

//Category schema
exports.AddCategorySchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.category.request_body.add_category.errors.error),
  category_name: yup
    .string("")
    .required(Json.category.request_body.add_category.errors.error3),
  merchant_id: yup
    .string("")
    .required(Json.category.request_body.add_category.errors.error4),
});

exports.GetCategoriesSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.category.request_body.get_categories.errors.error),
});

exports.GetCategorySchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.category.request_body.get_particular_category.errors.error),
  category_id: yup
    .string("")
    .required(Json.category.request_body.get_particular_category.errors.error2),
});

exports.UpdateCategorySchema = yup.object().shape({
  category_id: yup
    .string("")
    .required(Json.category.request_body.update_category.errors.error),
  category_name: yup
    .string("")
    .required(Json.category.request_body.update_category.errors.error3),
});

exports.DeleteCategoriesSchema = yup.object().shape({
  category_id: yup
    .string("")
    .required(Json.category.request_body.delete_category.errors.error),
});

exports.UpdateCategorieStatusSchema = yup.object().shape({
  category_id: yup
    .string("")
    .required(Json.category.request_body.delete_category.errors.error),
});

//Item Schema
exports.AddItemSchema = yup.object().shape({
  category_id: yup
    .string("")
    .required(Json.item.request_body.add_item.errors.error),
  item_name: yup
    .string("")
    .required(Json.item.request_body.add_item.errors.error2),
  item_image: yup
    .mixed()
    .nullable()
    .test("fileFormat", "Only image files are allowed", (value) => {
      if (value) {
        const fileType = value.type.split("/")[0];
        return fileType === "image";
      }
      return true;
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (value) {
        return value.size <= 5242880;
      }
      return true;
    }),
  item_price: yup
    .number("")
    .required(Json.item.request_body.add_item.errors.error4),
  item_description: yup
    .string("")
    .required(Json.item.request_body.add_item.errors.error5),
  store_id: yup
    .string("")
    .required(Json.item.request_body.add_item.errors.error7),
  merchant_id: yup
    .string("")
    .required(Json.item.request_body.add_item.errors.error8),
});

exports.GetItemsSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.item.request_body.get_items.errors.error),
  category_id: yup
    .string("")
    .required(Json.item.request_body.get_items.errors.error2),
  store_id: yup
    .string("")
    .required(Json.item.request_body.get_items.errors.error3),
});

exports.GetItemSchema = yup.object().shape({
  item_id: yup
    .string("")
    .required(Json.item.request_body.available_category_items.errors.error),
});

exports.UpdateItemSchema = yup.object().shape({
  item_id: yup
    .string("")
    .required(Json.item.request_body.update_item.errors.error),
  item_name: yup
    .string("")
    .required(Json.item.request_body.update_item.errors.error2),
  item_image: yup
    .mixed()
    .nullable()
    .test("fileFormat", "Only image files or URLs are allowed", (value) => {
      return isImageFile(value) || isURL(value);
    })
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (typeof value === "object" && value) {
        return value.size <= 5242880;
      }
      return true;
    }),

  item_price: yup
    .string("")
    .required(Json.item.request_body.update_item.errors.error4),
  item_description: yup
    .string("")
    .required(Json.item.request_body.update_item.errors.error5),
});

exports.DeleteItemSchema = yup.object().shape({
  item_id: yup
    .string("")
    .required(Json.item.request_body.delete_item.errors.error),
});

exports.AvailableCategoryItemSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.item.request_body.available_category_items.errors.error),
  store_id: yup
    .string("")
    .required(Json.item.request_body.available_category_items.errors.error1),
});

//Clerk schema
exports.AddClerkSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.clerk.request_body.add_clerk.errors.error),
  clerk_name: yup
    .string("")
    .required(Json.clerk.request_body.add_clerk.errors.error2),
  store_id: yup
    .string("")
    .required(Json.clerk.request_body.add_clerk.errors.error5),
});

exports.GetClerksSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.clerk.request_body.get_clerks.errors.error),
});

exports.GetClerkSchema = yup.object().shape({
  clerk_id: yup
    .string("")
    .required(Json.clerk.request_body.get_clerk.errors.error),
});

exports.UpdateClerkSchema = yup.object().shape({
  clerk_id: yup
    .string("")
    .required(Json.clerk.request_body.update_clerk.errors.error),
  clerk_name: yup
    .string("")
    .required(Json.clerk.request_body.update_clerk.errors.error2),
});

exports.DeleteClerkSchema = yup.object().shape({
  clerk_id: yup
    .string("")
    .required(Json.clerk.request_body.delete_clerk.errors.error),
});

exports.GetAllItemsSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.item.request_body.get_items.errors.error3),
});

exports.GetAllCategorySchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.category.request_body.get_particular_category.errors.error),
});

exports.BulkUpload = yup.object().shape({
  item_name: yup
    .string("")
    .required(Json.bulk_upload.request_body.uploaded.errors.error),
  item_price: yup
    .string("")
    .required(Json.bulk_upload.request_body.uploaded.errors.error2),
  category: yup
    .string("")
    .required(Json.bulk_upload.request_body.uploaded.errors.error4),
  store_id: yup
    .string("")
    .required(Json.bulk_upload.request_body.uploaded.errors.error5),
});

exports.BulkImageUpload = yup.object().shape({
  category: yup
    .string("")
    .required(Json.bulk_upload.request_body.bulkImageUpload.errors.error),
  store_id: yup
    .string("")
    .required(Json.bulk_upload.request_body.bulkImageUpload.errors.error2),
  item_name: yup
    .string("")
    .required(Json.bulk_upload.request_body.bulkImageUpload.errors.error3),
});

exports.GetOrderSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.orders.request_body.get_orders.errors.error),
});

exports.CancelOrderSchema = yup.object().shape({
  order_id: yup
    .string("")
    .required(Json.cancel_orders.request_body.get_orders.errors.error),
});

exports.CompletedOrderSchema = yup.object().shape({
  order_id: yup
    .string("")
    .required(Json.complete_order.request_body.get_orders.errors.error),
});

exports.createPosDeviceSchema = yup.object().shape({
  device_type: yup
    .string("")
    .required(Json.cerate_device.pos.request_body.errors.error),
  device_name: yup
    .string("")
    .required(Json.cerate_device.pos.request_body.errors.error2),
  store_id: yup
    .string("")
    .required(Json.cerate_device.pos.request_body.errors.error3),
  device_code: yup
    .string("")
    .required(Json.cerate_device.pos.request_body.errors.error4),
  device_serial_no: yup
    .string("")
    .required(Json.cerate_device.pos.request_body.errors.error5),
});

exports.createKdsDeviceSchema = yup.object().shape({
  device_type: yup
    .string("")
    .required(Json.cerate_device.kds.request_body.errors.error),
  device_name: yup
    .string("")
    .required(Json.cerate_device.kds.request_body.errors.error2),
  store_id: yup
    .string("")
    .required(Json.cerate_device.kds.request_body.errors.error3),
  device_code: yup
    .string("")
    .required(Json.cerate_device.kds.request_body.errors.error4),
});

exports.createTokenDeviceSchema = yup.object().shape({
  device_type: yup
    .string("")
    .required(Json.cerate_device.token.request_body.errors.error),
  device_name: yup
    .string("")
    .required(Json.cerate_device.token.request_body.errors.error2),
  store_id: yup
    .string("")
    .required(Json.cerate_device.token.request_body.errors.error3),
  device_code: yup
    .string("")
    .required(Json.cerate_device.token.request_body.errors.error4),
});


exports.getDeviceSchema = yup.object().shape({
  device_type: yup
    .string("")
    .required(Json.get_devices.request_body.errors.error),
  store_id: yup
    .string("")
    .required(Json.get_devices.request_body.errors.error2),

});


exports.deleteDeviceSchema = yup.object().shape({
  device_id: yup
    .string("")
    .required(Json.delete_device.request_body.errors.error),
  
});

