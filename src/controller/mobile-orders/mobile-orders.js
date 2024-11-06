const { mobileOrderSchema } = require("../../utils/validation/mobile-orders");
const { createOrder } = require("../../handler/mobile-orders/order/order");
const { getStores}   = require("../../handler/mobile-orders/store/store")
const yup = require("yup");
exports.CreateOrder = async function (req, res) {
    try {
      await mobileOrderSchema.validate(req.body, { abortEarly: false });
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


  exports.GetStores = async function (req, res) {
    try {
        console.log(req.body)
      const response = await getStores(req);
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
  