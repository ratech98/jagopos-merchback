const { login, verifyOTP, clerklogin, resendOtp, createCode, getCode } = require('../../../handler/kds/authentication/authentication')

//hooks
const {
  ClerkSchema,
  LoginSchema,
  VerifyOtpSchema,
  CreateCodeSchema,
  GetCodeSchema
} = require("../../../utils/validation/kds");

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

exports.VerifyOTP = async function (req, res) {
  try {
    await VerifyOtpSchema.validate(req.body, { abortEarly: false });
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


exports.ClerkLogin = async function (req, res) {
  try {
    await ClerkSchema.validate(req.body, { abortEarly: false });
    const response = await clerklogin(req);
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

exports.CreateCode = async function (req, res) {
  try {
    await CreateCodeSchema.validate(req.body, { abortEarly: false });
    const response = await createCode(req);
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


exports.GetCode = async function (req, res) {
  try {
    await GetCodeSchema.validate(req.body, { abortEarly: false });
    const response = await getCode(req);
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
