const {
  getStoreData,
} = require("../../../handler/pos/download-store-data/download-store-data");

const { DownloadStoreSchema } = require("../../../utils/validation/pos");

const yup = require("yup");

exports.GetStoreData = async function (req, res) {
  try {
    await DownloadStoreSchema.validate(req.body, { abortEarly: false });
    const response = await getStoreData(req);
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
