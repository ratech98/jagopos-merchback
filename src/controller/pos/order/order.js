const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrder,
} = require("../../../handler/pos/order/order");

//hooks
const {
  createOderSchema,
  updateOrderSchema,
  getorderSchema,
  getordersSchema,
  paymentOderSchema,
} = require("../../../utils/validation/pos");

const yup = require("yup");

exports.CreateOrder = async function (req, res) {
  try {
    const schema =
      req.body.pay_type === "Cash"
        ? createOderSchema
        : req.body.pay_type === "Pay-Later"
        ? createOderSchema
        : paymentOderSchema;
    await schema.validate(req.body, { abortEarly: false });
    const response = await createOrder(req);
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

exports.GetOrders = async function (req, res) {
  try {
    await getordersSchema.validate(req.body, { abortEarly: false });
    const response = await getOrders(req);
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
    await updateOrderSchema.validate(req.body, { abortEarly: false });
    const response = await updateOrderStatus(req);
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

exports.GetOrder = async function (req, res) {
  try {
    await getorderSchema.validate(req.body, { abortEarly: false });
    const response = await getOrder(req);
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
