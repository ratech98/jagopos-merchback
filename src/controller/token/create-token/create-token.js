const {
  createToken,
  getCode,
  remove_code,
  checkCode
} = require("../../../handler/token/create-token/create-token");

const { GetCodeSchema, CreateCodeSchema, CheckCodeSchema} = require("../../../utils/validation/token");

const yup = require("yup");

exports.CreateToken = async function (req, res) {
  try {
    await CreateCodeSchema.validate(req.body, { abortEarly: false });
    const response = await createToken(req);
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

exports.RemoveCode = async function (req, res) {
  try {
    await GetCodeSchema.validate(req.body, { abortEarly: false });
    const response = await remove_code(req);
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


exports.CheckCode = async function (req, res) {
  try {
    await CheckCodeSchema.validate(req.body, { abortEarly: false });
    const response = await checkCode(req);
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