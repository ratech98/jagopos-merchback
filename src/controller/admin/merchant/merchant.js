const {
  addMerchant,
  getAllMerchant,
  updateMerchant,
  getMerchant,
  deleteMerchant,
  merchantToken,
  full_logo,
  small_logo,
} = require("../../../handler/admin/merchant/merchant");

const {
  AdminAddMerchantSchema,
  AdminUpdateMerchantSchema,
  AdminGetMerchantSchema,
  AdminDeleteMerchantSchema,
  MerchantTokenSchema,
} = require("../../../utils/validation/admin");

const yup = require("yup");

exports.AddMerchant = async function (req, res) {
  try {
    await AdminAddMerchantSchema.validate(req.body, { abortEarly: false });
    
    const response = await addMerchant(req);
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

exports.AllMerchant = async function (req, res) {
  const response = await getAllMerchant(req);
  return res.status(response.responseCode).send(response);
};

exports.UpdateMerchant = async function (req, res) {
  try {
    await AdminUpdateMerchantSchema.validate(req.body, { abortEarly: false });
    const response = await updateMerchant(req);
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

exports.GetMerchant = async function (req, res) {
  try {
    await AdminGetMerchantSchema.validate(req.body, { abortEarly: false });
    const response = await getMerchant(req);
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

exports.DeleteMerchant = async function (req, res) {
  try {
    await AdminDeleteMerchantSchema.validate(req.body, { abortEarly: false });
    const response = await deleteMerchant(req);
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

exports.MerchantToken = async function (req, res) {
  try {
    await MerchantTokenSchema.validate(req.body, { abortEarly: false });
    const response = await merchantToken(req);
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

// exports.FullLogo = async function (req, res) {
//   const response = await full_logo(req);
//   res.status(response.responseCode).send(response);
// };

// exports.SmallLogo = async function (req, res) {
//   const response = await small_logo(req);
//   res.status(response.responseCode).send(response);
// };
