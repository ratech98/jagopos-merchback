const yup = require("yup");

const { Json } = require("../translate/web-order");

exports.PayNowSchema = yup.object().shape({
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
  // order_type: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error12),
  pay_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error13),
  // delivery_type: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error20),
  phone: yup
    .string("")
    .matches(
      /^[0-9]{10}$/,
      Json.create_order.request_body.create.errors.error19
    )
    .required(),
  sub_total: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error15),
  tax: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error16),
  total_price: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error17),
  merchant_name: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error18),

  billingAddress: yup.object().shape({
    line1: yup
      .string()
      .required(Json.create_order.request_body.create.errors.error21),
  postalCode: yup
      .string()
      .required(Json.create_order.request_body.create.errors.error22),
  }),
  accountNumber: yup
    .string()
    .matches(/^\d{16}$/, "Account number must be 16 digits")
    .required(Json.create_order.request_body.create.errors.error23),
  securityCode: yup
    .string()
    .matches(/^\d{3}$/, "Security code must be 3 digits")
    .required(Json.create_order.request_body.create.errors.error24),
  expirationMonth: yup
    .number()
    .min(1, "Invalid expiration month")
    .max(12, "Invalid expiration month")
    .required(Json.create_order.request_body.create.errors.error25),
  expirationYear: yup
    .number()
    .required(Json.create_order.request_body.create.errors.error26),
});

exports.PayLaterSchema = yup.object().shape({
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
  // order_type: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error12),
  pay_type: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error13),
  // delivery_type: yup
  //   .string("")
  //   .required(Json.create_order.request_body.create.errors.error20),
  phone: yup
    .string("")
    .matches(
      /^[0-9]{10}$/,
      Json.create_order.request_body.create.errors.error19
    )
    .required(),
  sub_total: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error15),
  tax: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error16),
  total_price: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error17),
  merchant_name: yup
    .string("")
    .required(Json.create_order.request_body.create.errors.error18),
});

exports.RefundPaymentSchema = yup.object().shape({
  transactionId: yup
    .string("")
    .required(Json.refundPayment.request_body.errors.error),
  merchant_name: yup
    .string("")
    .required(Json.refundPayment.request_body.errors.error2),
  store_name: yup
    .string("")
    .required(Json.refundPayment.request_body.errors.error3),
});
