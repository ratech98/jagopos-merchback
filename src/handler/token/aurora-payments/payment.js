const { PaymentLink } = require("../../../utils/translate/aurora-payment");
const {
  paymentTokenGenerate,
} = require("../../../utils/payment-token-generate/generate-payment-token");
const axios = require("axios");
const { Json } = require("../../../utils/translate/token");

exports.terminalStatus = async (req) => {
  const { terminal_id } = req.body;
  try {
    const { tokenResponse } = await paymentTokenGenerate();

    const listAllTerminal = {
      method: "get",
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_terminal_list}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    };

    try {
      const { data: terminalList } = await axios.request(listAllTerminal);

      const match = terminalList.items.find(
        (item) => item.serialNumber === terminal_id
      );

      if (match) {
        const terminalStatus = {
          method: "get",
          url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_terminal_list}/${match.id}/status`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        };

        try {
          const { data } = await axios.request(terminalStatus);

          const responseData = {
            status: data.terminalPosStatus,
          };

          return {
            responseCode: 200,
            resultCode: Json.terminal_status.success.resultCode,
            success: true,
            message: Json.terminal_status.success.message,
            data: responseData,
          };
        } catch (error) {
          return {
            responseCode: 400,
            resultCode: Json.terminal_status.error.resultCode,
            success: false,
            message: error.message,
          };
        }
      }
    } catch (error) {
      return {
        responseCode: 400,
        resultCode: Json.terminal_status.error.resultCode,
        success: false,
        message: Json.terminal_status.error.message1,
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.terminal_status.error.resultCode,
      success: false,
      message: error.message,
    };
  }
};
