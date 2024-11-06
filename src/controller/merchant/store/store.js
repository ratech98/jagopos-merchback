const {
  addStore,
  getStore,
  getStores,
  updateStore,
  deleteStore,
  getAllStores,
} = require("../../../handler/merchant/store/store");

const {
  AddStoreSchema,
  GetStoreSchema,
  UpdateStoreSchema,
  DeleteStoreSchema,
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.AddStore = async function (req, res) {
  try {
    await AddStoreSchema.validate(req.body, { abortEarly: false });
    const response = await addStore(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.errors;
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.GetStores = async function (req, res) {
  try {
    const response = await getStores(req);
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

exports.GetStore = async function (req, res) {
  try {
    await GetStoreSchema.validate(req.body, { abortEarly: false });
    const response = await getStore(req);
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

exports.UpdateStore = async function (req, res) {
  try {
    await UpdateStoreSchema.validate(req.body, { abortEarly: false });
    const response = await updateStore(req);
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

exports.DeleteStore = async function (req, res) {
  try {
    await DeleteStoreSchema.validate(req.body, { abortEarly: false });
    const response = await deleteStore(req);
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

