const yup = require("yup");

//Translate
const { Json } = require("../translate/pos");

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

exports.ClerkSchema = yup.object().shape({
  password: yup
    .string("")
    .required(Json.merchant.request_body.clerk_login.errors.error),
});

exports.createOderSchema = yup.object().shape({
  order_date: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error),
  order_time: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error2),
  store_name: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error3),
  store_id: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error4),
  // cusomer_name: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error5),
  // delivery_fee: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error6),
  discount: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error7),
  order_data: yup
    .array()
    .required(Json.create_order.request_body.create.errors.error9),
  // orderId: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error10),
  // order_status: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error11),
  order_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error12),
  pay_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error13),
  delivery_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error18),
  // phone: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error14),
  sub_total: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error15),
  tax: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error16),
  total_price: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error17),
});

exports.updateOrderSchema = yup.object().shape({
  order_id: yup
    .string("")
    .required(Json.create_order.request_body.update_order.errors.error),
});

exports.DownloadStoreSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.item.request_body.get_all_items.errors.error2),
  store_id: yup
    .string("")
    .required(Json.item.request_body.get_all_items.errors.error),
});

exports.getordersSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.create_order.request_body.get_orders.errors.error),
  store_id: yup
    .string("")
    .required(Json.create_order.request_body.get_orders.errors.error2),
});

exports.getorderSchema = yup.object().shape({
  store_id: yup
    .string("")
    .required(Json.create_order.request_body.get_order.errors.error),
  order_id: yup
    .string("")
    .required(Json.create_order.request_body.get_order.errors.error2),
});

exports.paymentOderSchema = yup.object().shape({
  order_date: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error),
  order_time: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error2),
  store_name: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error3),
  store_id: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error4),
  // cusomer_name: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error5),
  // delivery_fee: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error6),
  discount: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error7),
  order_data: yup
    .array()
    .required(Json.create_order.request_body.create.errors.error9),
  // orderId: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error10),
  // order_status: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error11),
  order_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error12),
  pay_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error13),
  delivery_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error18),
  // phone: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error14),
  sub_total: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error15),
  tax: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error16),
  total_price: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error17),
  terminal_id: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error19),
});

exports.PaymentStatusSchema = yup.object().shape({
  transaction_id: yup.string("").required(Json.payment_status.message),
  token: yup.string("").required(Json.payment_status.message1),
  order_id: yup.string("").required(Json.payment_status.message2),
});

exports.CancelPaymentSchema = yup.object().shape({
  order_id: yup.string("").required(Json.payment_status.message),
});

exports.TerminalResetSchema = yup.object().shape({
  terminal_id: yup
    .string("")
    .required(Json.terminal_reset.request_body.errors.error),
});

exports.RefundPaymentSchema = yup.object().shape({
  transactionId: yup
    .string("")
    .required(Json.paymeny_refund.request_body.errors.error),
  store_id: yup
    .string("")
    .required(Json.paymeny_refund.request_body.errors.error2),
});

exports.GetCodeSchema = yup.object().shape({
  mac_address: yup.string("").required(Json.get_code.request_body.error),
});

exports.CreateCodeSchema = yup.object().shape({
  mac_address: yup.string("").required(Json.create_code.request_body.errors.error),
  merchant_id: yup.string("").required(Json.create_code.request_body.errors.error2),
 
});
