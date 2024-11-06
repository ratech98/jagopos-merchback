const {
  login,
  verifyOTP,
  resendOTP
} = require("../../../handler/merchant/authentication/authentication");

const {
  LoginSchema,
  VerifyOtpSchema,
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.Login = async function (req, res) {
  try {
    await LoginSchema.validate(req.body, { abortEarly: false });
    const response = await login(req);
    res.status(response.responseCode).send(response);
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
    await VerifyOtpSchema.validate(req.body, { abortEarly: false });
    const response = await verifyOTP(req);
    res.status(response.responseCode).send(response);
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


exports.ResendOTP = async function (req, res) {
  try {
    await LoginSchema.validate(req.body, { abortEarly: false });
    const response = await resendOTP(req);
    res.status(response.responseCode).send(response);
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
