const axios = require("axios");
const generateRandom = require("short-unique-id");
const {
  paymentTokenGenerate,
} = require("../../../utils/payment-token-generate/generate-payment-token");

const { CreateOrderSchema, StoreSchema } = require("../../../models/common");

const { Json } = require("../../../utils/translate/pos");

const { paymentObject } = require("../../../utils/autora-payment");
const { PaymentLink } = require("../../../utils/translate/aurora-payment");
const {
  timeOutFunction,
  terminalStatusConnection,
} = require("../../../utils/api-timeout");

//  "c15b8fb1-3868-4b6d-8da6-792b6943a401"
exports.createPaymentIntent = async ({ access_token, payment, terminalId }) => {
  const { randomUUID: uid } = new generateRandom({ length: 10 });
  const randomUUID = uid().toUpperCase();

  const bodyData = {
    posDeviceId: "002",
    referenceId: randomUUID,
    transactionTypeId: 2,
    targetTransactionId: null,
    amount: `${payment}`,
    useCardPrice: null,
    currencyId: "1",
    paymentProcessorId: paymentObject.availablePaymentProcessors[0].id,
    terminalId: terminalId,
    waitForAcceptanceByTerminal: true,
    readingMethodId: 1,
  };

  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_pos_sale}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      data: bodyData,
      timeout: timeOutFunction(),
    };

    const { data } = await axios.request(config);

    return {
      responseCode: 200,
      success: true,
      data,
      message: "Transaction successful",
      referenceID: randomUUID,
    };
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      const config = {
        method: "get",
        url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_terminal_reset}?terminalId=${terminalId}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      };

      await axios.request(config);

      return {
        responseCode: 400,
        success: false,
        resultCode: Json.create_order.error.create.resultCode,
        message: Json.create_order.error.create.message2,
        code: "TIMED_OUT",
      };
    }

    return {
      responseCode: 400,
      resultCode: Json.create_order.error.create.resultCode,
      success: false,
      message: Json.create_order.error.create.message1,
    };
  }
};

exports.getPaymentStatus = async (req) => {
  const { dburi } = req;
  const { transaction_id, token, order_id } = req.body;

  try {
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

    const config = {
      method: "get",
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_payment_status_check}${transaction_id}?waitForTransactionProcessing=true`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: terminalStatusConnection(),
    };

    const { data } = await axios.request(config);

    let responseObject = {
      status: data.posTransactionStatus,
      transaction_details:
        data.transaction !== null
          ? {
              datetime: data?.createdOn,
              status: data?.transaction?.transactionStatus,
              hostresponsecode: null,
              hostresponsemessage: null,
              processorresponsecode: null,
              authcode: data?.transaction?.authCode,
            }
          : null,
      payment_reference_id: data.referenceId,
      payment_terminal_id: data.terminalId,
      transaction_id: data.transactionId,
    };

    if (
      data.posTransactionStatus === "CancelByPos" ||
      data.posTransactionStatus === "CancelByTerminal" ||
      data.posTransactionStatus === "DeclinedByProcessor" ||
      data?.transaction?.authCode === null
    ) {
      const res = await CreateOrderschema.findById(order_id);

      if (res && res.order_status === "Pending") {
        await CreateOrderschema.findByIdAndDelete(order_id);
      }

      return {
        responseCode: 200,
        resultCode: Json.create_order.error.payment_status.resultCode,
        success: false,
        message: Json.create_order.error.payment_status.message,
        data: responseObject,
      };
    }

    if (data.posTransactionStatus === "Completed") {
      let bodyData;

      if (data.transaction !== null) {
        bodyData = {
          order_status: "Paid",
          transaction_id: data.transactionId,
          payment_status: data.posTransactionStatus,
          payment_transaction: {
            datetime: data?.createdOn || "",
            status: data?.transaction?.transactionStatus || "",
            hostresponsecode: "",
            hostresponsemessage: "",
            processorresponsecode: "",
            authcode: data?.transaction?.authCode || "",
          },
        };
      } else {
        bodyData = {
          order_status: "Paid",
          transaction_id: data.transactionId,
        };
      }

      const getCompletedResponse = await CreateOrderschema.findByIdAndUpdate(
        order_id,
        bodyData,
        { new: true }
      );

      responseObject.pay_type = getCompletedResponse.pay_type;
    }

    return {
      responseCode: 200,
      resultCode: Json.create_order.success.payment_status.resultCode,
      success: true,
      message: Json.create_order.success.payment_status.message,
      data: responseObject,
    };
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.create_order.error.create.resultCode,
      success: false,
      message: error.message,
    };
  }
};

exports.cancelPayment = async (req) => {
  const { dburi } = req;

  const { order_id } = req.body;

  try {
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

    const res = await CreateOrderschema.findById(order_id);

    if (!res) {
      return {
        responseCode: 500,
        resultCode: Json.order_cancel.error.resultCode,
        message: Json.order_cancel.error.message2,
        success: false,
      };
    }

    const { tokenResponse } = await paymentTokenGenerate();

    if (
      res.pay_type === "Card" &&
      (res.order_status === "Accepted" || res.order_status === "Paid")
    ) {
      const bodyData = {
        cardDataSource: 1,
        transactionId: res.transaction_id,
        amount: res.total_price,
      };

      const config = {
        method: "post",
        url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_refund}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
        data: bodyData,
      };

      try {
        const { data } = await axios.request(config);

        await CreateOrderschema.findByIdAndUpdate(order_id, {
          payment_status: data.status,
          order_status: "Cancelled",
        });

        return {
          responseCode: 200,
          resultCode: Json.order_cancel.success.resultCode,
          success: true,
          message: Json.order_cancel.success.message,
          data: data,
        };
      } catch (error) {
        return {
          responseCode: 500,
          success: true,
          resultCode: Json.order_cancel.error.resultCode,
          message: Json.order_cancel.error.message,
          data_error: error.response.data.Errors.Amount[0],
        };
      }
    } else if (res.pay_type === "Card" && res.order_status === "Pending") {
      const config = {
        method: "post",
        url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_payment_status_check}${res.transaction_status_id}/cancel`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      };

      const { data } = await axios.request(config);

      await CreateOrderschema.findByIdAndDelete(order_id);

      return {
        responseCode: 200,
        resultCode: Json.order_cancel.success.resultCode,
        success: true,
        message: Json.order_cancel.success.message,
        data: data,
      };
    } else if (res.pay_type === "Cash" || res.pay_type === "Pay-Later") {
      await CreateOrderschema.findByIdAndUpdate(order_id, {
        order_status: "Cancelled",
      });

      return {
        responseCode: 200,
        resultCode: Json.order_cancel.success.resultCode,
        success: true,
        message: Json.order_cancel.success.message,
      };
    }

    return {
      responseCode: 500,
      resultCode: Json.order_cancel.error.resultCode,
      success: false,
      message: Json.order_cancel.error.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.order_cancel.error.resultCode,
      message: Json.order_cancel.error.message,
      success: false,
      message: error.message,
    };
  }
};

exports.listAllTerminals = async (req) => {
  try {
    const { tokenResponse } = await paymentTokenGenerate();

    const config = {
      method: "get",
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_terminal_list}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    };

    // Fetch terminals data
    const { data } = await axios.request(config);

    // Use Promise.all to handle concurrent requests
    const statusPromises = data.items.map(async (item) => {
      const terminalStatus = {
        method: "get",
        url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_terminal_list}/${item.id}/status`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      };

      // Fetch terminal status
      const { data: statusData } = await axios.request(terminalStatus);

      return {
        status: statusData.terminalPosStatus,
        id: item.id,
        serial_number: item.serialNumber,
      };
    });

    // Wait for all promises to resolve
    const terminalStatuses = await Promise.all(statusPromises);

    return {
      responseCode: 200,
      resultCode: Json.create_order.success.create.resultCode,
      success: true,
      message: "Successfully retrieved terminal list",
      data: terminalStatuses,
    };
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.create_order.error.create.resultCode,
      success: false,
      message: error.message,
    };
  }
};

exports.reset_terminal = async (req) => {
  const { terminal_id } = req.body;

  try {
    const { tokenResponse } = await paymentTokenGenerate();

    const config = {
      method: "get",
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_terminal_reset}?terminalId=${terminal_id}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    };

    const { data } = await axios.request(config);

    if (data?.items?.length === 0) {
      return {
        responseCode: 500,
        resultCode: Json.terminal_reset.error.resultCode,
        success: false,
        message: Json.terminal_reset.error.message,
      };
    }

    const getItems = data.items[0].id;

    const configCancel = {
      method: "post",
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_payment_status_check}${getItems}/cancel`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    };

    if (
      data.items[0].posTransactionStatus === "TransactionProcessing" ||
      data.items[0].posTransactionStatus === "TerminalConnecting"
    ) {
      await axios.request(configCancel);
    }

    return {
      responseCode: 200,
      resultCode: Json.terminal_reset.success.resultCode,
      success: true,
      message: Json.terminal_reset.success.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.terminal_reset.error.resultCode,
      success: false,
      message: Json.terminal_reset.error.message,
      db_error: error.message,
    };
  }
};

exports.refundPayment = async (req) => {
  const { dburi } = req;
  const { transactionId, store_id } = req.body;

  try {
    const Storechema = await dburi.model("stores", StoreSchema.schema);
    const store = await Storechema.findById(store_id);

    if (!store) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.paymeny_refund.error.resultCode,
        message: Json.paymeny_refund.error.message1,
      };
    }

    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );

    const orders = await CreateOrderschema.findOne({
      transaction_id: transactionId,
    });

    if (!orders) {
      return {
        responseCode: 400,
        success: false,
        resultCode: Json.paymeny_refund.error.resultCode,
        message: Json.paymeny_refund.error.message2,
      };
    }

    const bodyData = {
      cardDataSource: 1,
      transactionId,
      amount: orders.total_price,
    };

    const { tokenResponse } = await paymentTokenGenerate();

    const config = {
      method: "post",
      url: `${PaymentLink.aurora_domain}${PaymentLink.aurora_refund}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
      data: bodyData,
    };

    try {
      const { data } = await axios.request(config);

      if (data.status !== "Declined") {
        await CreateOrderschema.findByIdAndUpdate(orders._id, {
          pay_type: "Refunded",
          payment_status: data.status,
          order_status: "Cancelled",
        });

        return {
          responseCode: 200,
          success: true,
          resultCode: Json.paymeny_refund.success.resultCode,
          message: Json.paymeny_refund.success.message,
        };
      }
    } catch (error) {
      return {
        responseCode: 500,
        success: true,
        resultCode: Json.paymeny_refund.error.resultCode,
        message: Json.paymeny_refund.error.message,
        data_error: error.response.data.Errors.Amount[0],
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      success: true,
      resultCode: Json.paymeny_refund.error.resultCode,
      message: Json.paymeny_refund.error.message,
      data_error: error.message,
    };
  }
};
