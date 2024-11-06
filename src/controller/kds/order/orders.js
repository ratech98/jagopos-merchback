const {
  OrderClosed,
  OrderOpened,
  updateOrder,
  closeOrder,
  recall,
  front,
} = require("../../../handler/kds/orders/orders");

const {
  UpdateOrderSchema,
  defaultSchema,
  recallSchema,
} = require("../../../utils/validation/kds");

const yup = require("yup");

exports.GetOrdersOpened = async function (req, res) {
  try {
    await defaultSchema.validate(req.body, { abortEarly: false });
    const response = await OrderOpened(req);
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

exports.GetOrdersClosed = async function (req, res) {
  try {
    await defaultSchema.validate(req.body, { abortEarly: false });
    const response = await OrderClosed(req);
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

exports.UpdateOrder = async function (req, res) {
  try {
    await UpdateOrderSchema.validate(req.body, { abortEarly: false });
    const response = await updateOrder(req);
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

exports.CloseOrder = async function (req, res) {
  try {
    await defaultSchema.validate(req.body, { abortEarly: false });
    const response = await closeOrder(req);
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

exports.Recall = async function (req, res) {
  try {
    await recallSchema.validate(req.body, { abortEarly: false });
    const response = await recall(req);
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

exports.Front = async function (req, res) {
  try {
    await recallSchema.validate(req.body, { abortEarly: false });
    const response = await front(req);
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
