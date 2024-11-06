const {
  addCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  getAllCategories
} = require("../../../handler/merchant/category/category");

const {
  AddCategorySchema,
  GetCategoriesSchema,
  GetCategorySchema,
  UpdateCategorySchema,
  DeleteCategoriesSchema,
  UpdateCategorieStatusSchema,
  GetAllCategorySchema
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.AddCategory = async function (req, res) {
  try {
    await AddCategorySchema.validate(req.body, { abortEarly: false });
    const response = await addCategory(req);

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

exports.GetCategories = async function (req, res) {
  try {
    await GetCategoriesSchema.validate(req.body, { abortEarly: false });
    const response = await getCategories(req);
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

exports.GetCategory = async function (req, res) {
  try {
    await GetCategorySchema.validate(req.body, { abortEarly: false });
    const response = await getCategory(req);
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

exports.UpdateCategory = async function (req, res) {
  try {
    await UpdateCategorySchema.validate(req.body, { abortEarly: false });
    const response = await updateCategory(req);
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

exports.DeleteCategory = async function (req, res) {
  try {
    await DeleteCategoriesSchema.validate(req.body, { abortEarly: false });
    const response = await deleteCategory(req);
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


exports.UpdateCategoryStatus = async function (req, res) {
  try {
    await UpdateCategorieStatusSchema.validate(req.body, { abortEarly: false });
    const response = await updateCategoryStatus(req);
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


exports.GetAllCategories = async function (req, res) {
  try {
    await GetAllCategorySchema.validate(req.body, { abortEarly: false });
    const response = await getAllCategories(req);
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