const {
  addBulkData,
  removeAll,
  bulkImageUpload,
} = require("../../../handler/merchant/bulk/bulk-data-upload");

const {
  BulkUpload,
  GetAllCategorySchema,
  BulkImageUpload,
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.BulkDataUpload = async function (req, res) {
  try {
    await BulkUpload.validate(req.body, { abortEarly: false });
    const response = await addBulkData(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.errors;
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.RemoveAll = async function (req, res) {
  try {
    await GetAllCategorySchema.validate(req.body, { abortEarly: false });
    const response = await removeAll(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.errors;
      return res.status(400).json({ message: errorMessages });
    }
  }
};

exports.BulkImageUpload = async function (req, res) {
  try {
    await BulkImageUpload.validate(req.body, { abortEarly: false });
    const response = await bulkImageUpload(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errorMessages = err.errors;
      return res.status(400).json({ message: errorMessages });
    }
  }
};
