const {
  createKdsDevice,
  createPosDevice,
  createTokenDevice,
  getDevices,
  deleteDevice,
} = require("../../../handler/merchant/devices/devices");

const {
  createPosDeviceSchema,
  createKdsDeviceSchema,
  createTokenDeviceSchema,
  getDeviceSchema,
  deleteDeviceSchema,
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.CreatePosDevice = async function (req, res) {
  try {
    await createPosDeviceSchema.validate(req.body, { abortEarly: false });
    const response = await createPosDevice(req);
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

exports.CreateKdsDevice = async function (req, res) {
  try {
    await createKdsDeviceSchema.validate(req.body, { abortEarly: false });
    const response = await createKdsDevice(req);
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

exports.CreateTokenDevice = async function (req, res) {
  try {
    await createTokenDeviceSchema.validate(req.body, { abortEarly: false });
    const response = await createTokenDevice(req);
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

exports.GetDevices = async function (req, res) {
  try {
    await getDeviceSchema.validate(req.body, { abortEarly: false });
    const response = await getDevices(req);
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

exports.DeleteDevice = async function (req, res) {
  try {
    await deleteDeviceSchema.validate(req.body, { abortEarly: false });
    const response = await deleteDevice(req);
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
