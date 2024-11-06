const {
  createPos,
  disconnect_tv,
  getPos,
  updateTerminal
} = require("../../../handler/token/tv/device");

//hooks
const {
  CreatePosSchema,
  DisconnectPosSchema,
  GetPosSchema,
  CreateKdsSchema,
  UpdateTerminalSchema
} = require("../../../utils/validation/token");

const yup = require("yup");

exports.CreateDevice = async function (req, res) {
  try {
    const schema = req.body.type === "POS" ? CreatePosSchema : CreateKdsSchema;
    await schema.validate(req.body, { abortEarly: false });
    const response = await createPos(req);
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

exports.GetDevice = async function (req, res) {
  try {
    await GetPosSchema.validate(req.body, { abortEarly: false });
    const response = await getPos(req);
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

exports.DisconnectDevice = async function (req, res) {
  try {
    await DisconnectPosSchema.validate(req.body, { abortEarly: false });
    const response = await disconnect_tv(req);
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



exports.UpdateTerminal = async function (req, res) {
  try {
    await UpdateTerminalSchema.validate(req.body, { abortEarly: false });
    const response = await updateTerminal(req);
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
