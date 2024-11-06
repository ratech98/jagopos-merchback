//admin validation

const yup = require("yup");

//Translate
const { Json } = require("../translate/admin");

exports.AdminLoginSchema = yup.object().shape({
  admin_phone: yup
    .string("")
    .required(Json.admin.request_body.login_admin.errors.error),
});

exports.AdminVerifyOtpSchema = yup.object().shape({
  otp: yup.string().required(Json.admin.request_body.verify_admin.errors.error),
  type: yup
    .string("")
    .required(Json.admin.request_body.verify_admin.errors.error1),
});

exports.AdminAddMerchantSchema = yup.object().shape({
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
    .required(Json.merchant.request_body.add_merchant.errors.error13),
  add_method: yup
    .string("")
    .required(Json.merchant.request_body.add_merchant.errors.error14),
});

exports.AdminUpdateMerchantSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error),
  merchant_name: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error2),
  // merchant_phone_number: yup
  //   .string("")
  //   .required(Json.merchant.request_body.update_merchant.errors.error3),
  merchant_street: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error4),
  merchant_city: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error5),
  merchant_state: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error6),
  merchant_zip_code: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error7),
  contact_name: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error8),
  contact_phone_number: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error9),
  contact_street: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error10),
  contact_city: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error11),
  contact_state: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error12),
  contact_zip_code: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error13),
  pricing: yup
    .string("")
    .required(Json.merchant.request_body.update_merchant.errors.error14),
  full_logo: yup.string("").optional(),
  small_logo: yup.string("").optional(),
});

exports.AdminGetMerchantSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.merchant.request_body.get_merchant.errors.error),
});

exports.AdminDeleteMerchantSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.merchant.request_body.delete_merchant.errors.error),
});

exports.MerchantTokenSchema = yup.object().shape({
  merchant_id: yup
    .string("")
    .required(Json.merchant.request_body.merchant_token.errors.error),
});



exports.AddDomainSchema = yup.object().shape({
  domain: yup
    .string()
    .required(Json.add_url.errors["domain-required"])
    .url(Json.add_url.errors["url-validation"])
    .default(""),
});
