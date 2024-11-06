const {
  addurl,
  geturl,
} = require("../../../handler/admin/web-order/web-order");

const { AddDomainSchema } = require("../../../utils/validation/admin");

const yup = require("yup");

exports.AddURL = async function (req, res) {
  try {
    await AddDomainSchema.validate(req.body, { abortEarly: false });
    const response = await addurl(req);
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

exports.GetURL = async function (req, res) {
  try {
    const response = await geturl(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
