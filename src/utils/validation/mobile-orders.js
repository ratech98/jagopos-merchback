
const yup = require("yup");

const { Json } = require("../translate/web-order");

exports.mobileOrderSchema = yup.object().shape({
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