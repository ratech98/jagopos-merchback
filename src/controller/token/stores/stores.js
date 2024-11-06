const {
  stores,
  updateStoreTime
} = require("../../../handler/token/stores/stores");

const { UpdateTimeSchema } = require("../../../utils/validation/token");

const yup = require("yup");

exports.GetStores = async function (req, res) {
  try {
    const response = await stores(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.UpdateTime = async function (req, res) {
  try {
    await UpdateTimeSchema.validate(req.body, { abortEarly: false });
    const response = await updateStoreTime(req);
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


