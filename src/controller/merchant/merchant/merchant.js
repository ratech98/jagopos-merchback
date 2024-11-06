const {
  addMerchant,
  getMerchant,
  updateMerchant,
} = require("../../../handler/merchant/merchant/merchant");

const {
  AddMerchantSchema,
  UpdateMerchantSchema,
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.AddMerchant = async function (req, res) {
  try {
    await AddMerchantSchema.validate(req.body, { abortEarly: false });
    const response = await addMerchant(req);
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

exports.GetMerchant = async function (req, res) {
  const response = await getMerchant(req);
  res.status(response.responseCode).send(response);
};

exports.UpdateMerchant = async function (req, res) {
  try {
    await UpdateMerchantSchema.validate(req.body, { abortEarly: false });
    const response = await updateMerchant(req);
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
