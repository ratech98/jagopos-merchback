const {
  createstoretv,
  getstoretv,
  getOrders,
  disconnect_tv,
  enableService,
} = require("../../../handler/token/tv/token_tv");

//hooks
const {
  CreateTVSchema,
  GetTVSchema,
  DisconnectSchema,
  ShowNameSchema,
  TokenAnnouncementSchema,
  LayoutSchema,
} = require("../../../utils/validation/token");

const yup = require("yup");

exports.CreateTV = async function (req, res) {
  try {
    await CreateTVSchema.validate(req.body, { abortEarly: false });
    const response = await createstoretv(req);
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

exports.GetTV = async function (req, res) {
  try {
    await GetTVSchema.validate(req.body, { abortEarly: false });
    const response = await getstoretv(req);
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

exports.GetOrders = async function (req, res) {
  try {
    const response = await getOrders(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    return res.status(400).json({ message: errorMessages });
  }
};

exports.DisconnectTV = async function (req, res) {
  try {
    await DisconnectSchema.validate(req.body, { abortEarly: false });
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

exports.EnableService = async function (req, res) {
  try {
    const schema =
      req.body.show_name !== undefined
        ? ShowNameSchema
        : req.body.token_announcement !== undefined
        ? TokenAnnouncementSchema
        : LayoutSchema;
    await schema.validate(req.body, { abortEarly: false });
    const response = await enableService(req);
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
