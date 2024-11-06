const axios = require("axios");
const qs = require("qs");
const { PaymentLink } = require("../translate/aurora-payment");

exports.paymentTokenGenerate = async () => {
  try {
    const tokenData = qs.stringify({
      grant_type: process.env._AURORA_GRANT_TYPE,
      client_id: process.env._AURORA_CLIENT_ID,
      client_secret: process.env._AURORA_CLIENT_SECRET,
      scope: process.env._AURORA_SCOPE,
    });

    

    const tokenConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PaymentLink.aurora_oauth_domain}${PaymentLink.aurora_generate_token}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: tokenData,
    };

    const { data: tokenResponse } = await axios.request(tokenConfig); // Fetch access token

    return {
      success: true,
      tokenResponse,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
