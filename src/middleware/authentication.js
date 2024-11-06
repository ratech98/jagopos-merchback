const jwt = require("jsonwebtoken");

const { Json } = require("../utils/translate/admin");

exports.Authentication = async (req, res, next) => {
  try {
    const token = await req.headers["authorization"];
    const tokens = token.split(" ")[1];
    const data = await jwt.verify(tokens, process.env._JWT_SECRET_KEY);
    req.id = data.id;
    next();
  } catch (error) {
    return res.status(Json.token_error.responseCode).json({
      resultCode: Json.token_error.resultCode,
      message: Json.token_error.message,
    });
  }
};

exports.PosAuthentication = async (req, res, next) => {
  try {
    const token = await req.headers["authorization"];
    const tokens = token.split(" ")[1];
    const data = await jwt.verify(tokens, process.env._JWT_SECRET_KEY);
    

    if (data.user === "clerk" || data.user === "merchant") {
      req.user = data.user;
      req.id = data.id;
      req.mac_address = data.mac_address

      next();
    } else {
      return res.status(Json.token_error.responseCode).json({
        resultCode: Json.token_error.resultCode,
        message: Json.token_error.message,
      });
    }
  } catch (error) {
    return res.status(Json.token_error.responseCode).json({
      resultCode: Json.token_error.resultCode,
      message: Json.token_error.message,
    });
  }
};

exports.WebOrder = async (req, res, next) => {
  try {
    const token = await req.headers["authorization"];
    const tokens = token.split(" ")[1];
    await jwt.verify(tokens, process.env._JWT_SECRET_KEY);
    next();
  } catch (error) {
    return res.status(Json.token_error.responseCode).json({
      resultCode: Json.token_error.resultCode,
      message: Json.token_error.message,
    });
  }
};

exports.TokenAuthentication = async (req, res, next) => {
  try {
    const token = await req.headers["authorization"];
    const tokens = token.split(" ")[1];
    const data = await jwt.verify(tokens, process.env._JWT_SECRET_KEY);

    req.id = data.id;
    req.store_id = data.store_id;
    req.device_id = data.device_id;

    next();
  } catch (error) {
    return res.status(Json.token_error.responseCode).json({
      resultCode: Json.token_error.resultCode,
      message: Json.token_error.message,
    });
  }
};
