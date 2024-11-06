const {
  getstoreItems,
  createOrder,
  generateToken,
  refundPayment,
} = require("../../handler/web-orders/web-orders");

const {
  PayLaterSchema,
  PayNowSchema,
  RefundPaymentSchema,
} = require("../../utils/validation/web-orders");

const yup = require("yup");

exports.GenerateToken = async function (req, res) {
  try {
    const response = await generateToken(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.GetStoreItems = async function (req, res) {
  try {
    // await defaultSchema.validate(req.body, { abortEarly: false });
    const response = await getstoreItems(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    // if (err instanceof yup.ValidationError) {
    //   const errorMessages = err.inner.reduce((acc, currentError) => {
    //     acc[currentError.path] = currentError.message;
    //     return acc;
    //   }, {});
    //   return res.status(400).json({ message: errorMessages });
    // }
    return res.status(400).json({ message: err.message });
  }
};

exports.CreateOrder = async function (req, res) {
  try {
    const schema = req.body.pay_type === "Pay-Later" ? PayLaterSchema : PayNowSchema;
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

exports.RefundPayment = async function (req, res) {
  try {
    await RefundPaymentSchema.validate(req.body, { abortEarly: false });
    const response = await refundPayment(req);
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
