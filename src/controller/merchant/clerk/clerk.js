const {
  addClerk,
  getClerks,
  getClerk,
  updateClerk,
  deleteClerk,
  statusChange
} = require("../../../handler/merchant/clerk/clerk");

const {
  AddClerkSchema,
  GetClerkSchema,
  UpdateClerkSchema,
  GetClerksSchema,
  DeleteClerkSchema,
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.AddClerk = async function (req, res) {
  try {
    await AddClerkSchema.validate(req.body, { abortEarly: false });
    const response = await addClerk(req);
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

exports.GetClerks = async function (req, res) {
  try {
    await GetClerksSchema.validate(req.body, { abortEarly: false });
    const response = await getClerks(req);
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

exports.GetClerk = async function (req, res) {
  try {
    await GetClerkSchema.validate(req.body, { abortEarly: false });
    const response = await getClerk(req);
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

exports.UpdateClerk = async function (req, res) {
  try {
    await UpdateClerkSchema.validate(req.body, { abortEarly: false });
    const response = await updateClerk(req);
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

exports.DeleteClerk = async function (req, res) {
  try {
    await DeleteClerkSchema.validate(req.body, { abortEarly: false });
    const response = await deleteClerk(req);
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

exports.StatusChangeClerk = async function (req, res) {
  try {
    await DeleteClerkSchema.validate(req.body, { abortEarly: false });
    const response = await statusChange(req);
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
