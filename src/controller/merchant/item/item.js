const {
  addItem,
  getItem,
  getItems,
  updateItem,
  deleteItem,
  statusChange,
  getAllItems,
} = require("../../../handler/merchant/item/item");

const {
  AddItemSchema,
  AvailableCategoryItemSchema,
  DeleteItemSchema,
  GetItemSchema,
  GetItemsSchema,
  UpdateItemSchema,
  GetAllItemsSchema,
} = require("../../../utils/validation/merchant");

const yup = require("yup");

exports.AddItem = async function (req, res) {
  try {
    await AddItemSchema.validate(req.body, { abortEarly: false });
    const response = await addItem(req);
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

exports.GetItems = async function (req, res) {
  try {
    if (req.body.category) {
      await GetItemsSchema.validate(req.body, { abortEarly: false });
      const response = await getItems(req);
      return res.status(response.responseCode).send(response);
    } else {
      await AvailableCategoryItemSchema.validate(req.body, {
        abortEarly: false,
      });
      const response = await getItems(req);
      return res.status(response.responseCode).send(response);
    }
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

exports.GetItem = async function (req, res) {
  try {
    await GetItemSchema.validate(req.body, { abortEarly: false });
    const response = await getItem(req);
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

exports.UpdateItem = async function (req, res) {
  try {
    await UpdateItemSchema.validate(req.body, { abortEarly: false });
    const response = await updateItem(req);
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

exports.DeleteItem = async function (req, res) {
  try {
    await DeleteItemSchema.validate(req.body, { abortEarly: false });
    const response = await deleteItem(req);
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

exports.StatusChangeItem = async function (req, res) {
  try {
    await DeleteItemSchema.validate(req.body, { abortEarly: false });
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

exports.GetAllItems = async function (req, res) {
  try {
    await GetAllItemsSchema.validate(req.body, { abortEarly: false });
    const response = await getAllItems(req);
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
