const { getStores } = require("../../../handler/pos/store/store");

exports.GetStores = async function (req, res) {
  const response = await getStores(req);
  return res.status(response.responseCode).send(response);
};
