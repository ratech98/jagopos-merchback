const {
  getAdminDetails,
  login,
  verifyOTP,
} = require("../../../handler/admin/authentication/authentication");

//hooks
const {
  AdminLoginSchema,
  AdminVerifyOtpSchema,
} = require("../../../utils/validation/admin");

const yup = require("yup");

exports.Login = async function (req, res) {
  try {
    await AdminLoginSchema.validate(req.body, { abortEarly: false });
    const response = await login(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.VerifyOTP = async function (req, res) {
  try {
    await AdminVerifyOtpSchema.validate(req.body, { abortEarly: false });
    const response = await verifyOTP(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.GetAdminDetails = async function (req, res) {
  const response = await getAdminDetails(req);
  return res.status(response.responseCode).send(response);
};



exports.ResendOTP = async function (req, res) {
  try {
    await AdminLoginSchema.validate(req.body, { abortEarly: false });
    const response = await login(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.inner.reduce((acc, currentError) => {
        acc[currentError.path] = currentError.message;
        return acc;
      }, {});
      return res.status(400).json({ message: errorMessages });
    }
  }
};