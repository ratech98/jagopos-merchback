const yup = require("yup");

//Translate
const { Json } = require("../translate/kds");


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
    mac_address: yup
    .string("")
    .required(Json.merchant.request_body.verify_otp.errors.error3),
});

exports.ClerkSchema = yup.object().shape({
  password: yup
    .string("")
    .required(Json.merchant.request_body.clerk_login.errors.error),
});

exports.UpdateOrderSchema = yup.object().shape({
  order_id: yup
    .string("")
    .required(Json.orders.request_body.update_order.errors.error),
  date: yup
    .string("")
    .required(Json.orders.request_body.update_order.errors.error2),
  type: yup
    .string("")
    .required(Json.orders.request_body.update_order.errors.error3),
  store_id: yup
    .string("")
    .required(Json.orders.request_body.update_order.errors.error3),
});


exports.defaultSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.default.errors.error),
  store_id: yup
    .string("")
    .required(Json.default.errors.error2),
 
});


exports.recallSchema = yup.object().shape({
  order_id: yup
    .string("")
    .required(Json.orders.request_body.recall.errors.error),
    date: yup
    .string("")
    .required(Json.orders.request_body.recall.errors.error2),
    store_id: yup
    .string("")
    .required(Json.orders.request_body.recall.errors.error2),
 
});


exports.CreateCodeSchema = yup.object().shape({
  mac_address: yup.string("").required(Json.create_code.request_body.errors.error),
  merchant_id: yup.string("").required(Json.create_code.request_body.errors.error1),

 
});


exports.GetCodeSchema = yup.object().shape({
  mac_address: yup.string("").required(Json.create_code.request_body.errors.error),
 
});
