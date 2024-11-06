const {getOrders, cancelPayment, completedOrder} = require("../../../handler/merchant/orders/orders")

const {GetOrderSchema, CancelOrderSchema, CompletedOrderSchema} = require("../../../utils/validation/merchant")

const yup = require("yup");


exports.GetOrders = async function (req, res) {
    try {
      await GetOrderSchema.validate(req.body, { abortEarly: false });
      const response = await getOrders(req);
      return res.status(response.responseCode).send(response);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errorMessages = err.errors;
        return res.status(400).json({ message: errorMessages });
      }
    }
  };


  exports.CancelPayment = async function (req, res) {
    try {
      await CancelOrderSchema.validate(req.body, { abortEarly: false });
      const response = await cancelPayment(req);
      return res.status(response.responseCode).send(response);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errorMessages = err.errors;
        return res.status(400).json({ message: errorMessages });
      }
    }
  };


  exports.CompletedOrder = async function (req, res) {
    try {
      await CompletedOrderSchema.validate(req.body, { abortEarly: false });
      const response = await completedOrder(req);
      return res.status(response.responseCode).send(response);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errorMessages = err.errors;
        return res.status(400).json({ message: errorMessages });
      }
    }
  };


