const {
  getPaymentStatus,
  cancelPayment,
  listAllTerminals,
  reset_terminal,
  refundPayment
} = require("../../../handler/pos/aurora-payments/payment");

//hooks
const {
  PaymentStatusSchema,
  CancelPaymentSchema,
  TerminalResetSchema,
  RefundPaymentSchema
} = require("../../../utils/validation/pos");

const yup = require("yup");

exports.GetPaymentStatus = async (req, res) => {
  try {
    await PaymentStatusSchema.validate(req.body, { abortEarly: false });
    const response = await getPaymentStatus(req);
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

exports.CancelPayment = async (req, res) => {
  try {
    await CancelPaymentSchema.validate(req.body, { abortEarly: false });
    const response = await cancelPayment(req);
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


exports.ListAllTerminals = async (req, res) => {
  try {
    const response = await listAllTerminals(req);
    return res.status(response.responseCode).send(response);
  } catch (err) {
    return res.status(400).json({ message: errorMessages });
  }
};

exports.ResetTerminal = async (req, res) => {
  try {
    await TerminalResetSchema.validate(req.body, { abortEarly: false });
    const response = await reset_terminal(req);
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


exports.RefundPayment = async (req, res) => {
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
