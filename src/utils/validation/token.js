const yup = require("yup");

//Translate
const { Json } = require("../translate/token");

exports.LoginSchema = yup.object().shape({
  merchant_phone_number: yup
    .string("")
    .required(Json.token_app_login.request_body.errors.error),
});

exports.VerifyOtpSchema = yup.object().shape({
  otp: yup.string("").required(Json.token_app_login.request_body.errors.error2),
  type: yup
    .string("")
    .required(Json.token_app_login.request_body.errors.error3),
});

exports.CreateTVSchema = yup.object().shape({
  store_id: yup.string("").required(Json.tv.request_body.create.errors.error),
  name: yup.string("").required(Json.tv.request_body.create.errors.error2),
  code: yup.string("").required(Json.tv.request_body.create.errors.error3),
});

exports.GetTVSchema = yup.object().shape({
  store_id: yup.string("").required(Json.tv.request_body.get_tv.errors.error),
});

exports.DisconnectSchema = yup.object().shape({
  tv_id: yup
    .string("")
    .required(Json.disconnect_tv.request_body.disconnect_tv.errors.error2),
});

exports.GetCodeSchema = yup.object().shape({
  mac_address: yup.string("").required(Json.remove_code.request_body.errors.error),
  type: yup.string("").required(Json.remove_code.request_body.errors.error1),

});


exports.CheckCodeSchema = yup.object().shape({
  code: yup.string("").required(Json.check_code.request_body.errors.error),
  type: yup.string("").required(Json.check_code.request_body.errors.error1),

});


exports.ShowNameSchema = yup.object().shape({
  tv_id: yup
    .string("")
    .required(Json.enable_service.request_body.errors.error2),
  show_name: yup
    .string("")
    .required(Json.enable_service.request_body.errors.error3),
});

exports.TokenAnnouncementSchema = yup.object().shape({
  tv_id: yup
    .string("")
    .required(Json.enable_service.request_body.errors.error2),
  token_announcement: yup
    .string("")
    .required(Json.enable_service.request_body.errors.error4),
});

exports.LayoutSchema = yup.object().shape({
  tv_id: yup
    .string("")
    .required(Json.enable_service.request_body.errors.error2),
  layout: yup
    .string("")
    .required(Json.enable_service.request_body.errors.error5),
});

exports.CreatePosSchema = yup.object().shape({
  name: yup.string("").required(Json.create_pos.request_body.errors.error),
  store_id: yup.string("").required(Json.create_pos.request_body.errors.error2),
  code: yup.string("").required(Json.create_pos.request_body.errors.error3),
  type: yup.string("").required(Json.create_pos.request_body.errors.error4),
  serial_no: yup
    .string("")
    .required(Json.create_pos.request_body.errors.error6),
});

exports.CreateKdsSchema = yup.object().shape({
  name: yup.string("").required(Json.create_pos.request_body.errors.error),
  store_id: yup.string("").required(Json.create_pos.request_body.errors.error2),
  code: yup.string("").required(Json.create_pos.request_body.errors.error3),
  type: yup.string("").required(Json.create_pos.request_body.errors.error4),
});



exports.GetPosSchema = yup.object().shape({
  store_id: yup.string("").required(Json.get_pos.request_body.errors.error),
  type: yup.string("").required(Json.get_pos.request_body.errors.error2),
 
});

exports.DisconnectPosSchema = yup.object().shape({
  device_id: yup.string("").required(Json.disconnect_pos.request_body.errors.error),
 
});

exports.CreateCodeSchema = yup.object().shape({
  mac_address: yup.string("").required(Json.create_code.request_body.errors.error),
  type: yup.string("").required(Json.create_code.request_body.errors.error1),

 
});


exports.TerminalStatusSchema = yup.object().shape({
  terminal_id: yup.string("").required(Json.terminal_status.request_body.errors.error),
 
});

exports.UpdateTerminalSchema = yup.object().shape({
  device_id: yup.string("").required(Json.update_device.request_body.errors.error),
  serial_no: yup.string("").required(Json.update_device.request_body.errors.error1),
});


exports.UpdateTimeSchema = yup.object().shape({
  store_id: yup.string("").required(Json.set_close_time.request_body.errors.error),
  open_time: yup.string("").required(Json.set_close_time.request_body.errors.error2),
  close_time: yup.string("").required(Json.set_close_time.request_body.errors.error3),


});
