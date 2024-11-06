const {
   terminalStatus
  } = require("../../../handler/token/aurora-payments/payment");
  
  //hooks
  const {
    TerminalStatusSchema
  } = require("../../../utils/validation/token");
  
  const yup = require("yup");
  
  exports.TerminalStatus = async function (req, res) {
    try {
      await TerminalStatusSchema.validate(req.body, { abortEarly: false });
      const response = await terminalStatus(req);
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