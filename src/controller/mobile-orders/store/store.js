
const { getStores}   = require("../../../handler/mobile-orders/store/store")
const yup = require("yup");

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
  