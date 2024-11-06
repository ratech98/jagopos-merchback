const {
  login,
  verify,
  resendOtp,
  getMerchant
} = require("../../../handler/token/authentication/authentication");

//hooks
const {
  LoginSchema,
  VerifyOtpSchema,
} = require("../../../utils/validation/token");

const yup = require("yup");

exports.Login = async function (req, res) {
  try {
    await LoginSchema.validate(req.body, { abortEarly: false });
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


exports.Verify = async function (req, res) {
    try {
      await VerifyOtpSchema.validate(req.body, { abortEarly: false });
      const response = await verify(req);
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
  
  exports.ResendOTP = async function (req, res) {
    try {
      await LoginSchema.validate(req.body, { abortEarly: false });
      const response = await resendOtp(req);
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


  exports.GetMerchant = async function (req, res) {
    try {
      const response = await getMerchant(req);
      return res.status(response.responseCode).send(response);
    } catch (err) {
   
      return res.status(400).json({ message: err.message });
    }
  };