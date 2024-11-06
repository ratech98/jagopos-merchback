const router = require("express").Router();

const {
  Login,
  VerifyOTP,
  ClerkLogin,
  ResendOTP,
  CreatedCode,
  GetCode,
} = require("../../controller/pos/authentication/authentication");
const {
  GetStoreData,
} = require("../../controller/pos/download-store-data/download-store-data");
const {
  CreateOrder,
  GetOrders,
  UpdateOrder,
  GetOrder,
} = require("../../controller/pos/order/order");
const { GetStores } = require("../../controller/pos/store/store");

const {
  GetPaymentStatus,
  CancelPayment,
  ListAllTerminals,
  ResetTerminal,
  RefundPayment,
} = require("../../controller/pos/aurora-payments/payments");

const {
  Authentication,
  PosAuthentication,
} = require("../../middleware/authentication");
const { connectTenantDB } = require("../../config");

//Authentication
router.post("/jagopos-pos-merchant-login", Login);
router.post("/jagopos-pos-merchant-resend-otp", ResendOTP);
router.post("/jagopos-pos-verify-otp", [Authentication], VerifyOTP);
router.post(
  "/jagopos-pos-clerk-login",
  [PosAuthentication, connectTenantDB],
  ClerkLogin
);

//Get all Stores
router.get(
  "/jagopos-pos-get-all-stores",
  [Authentication, connectTenantDB],
  GetStores
);

//Get all items particular store
router.post(
  "/jagopos-pos-download-store-data",
  [PosAuthentication, connectTenantDB],
  GetStoreData
);

//Orders
router.post(
  "/aurora-terminal-create-sale",
  [PosAuthentication, connectTenantDB],
  CreateOrder
);
router.post(
  "/jagopos-pos-get-all-orders",
  [PosAuthentication, connectTenantDB],
  GetOrders
);
router.post(
  "/jagopos-pos-get-order",
  [PosAuthentication, connectTenantDB],
  GetOrder
);

router.put(
  "/jagopos-pos-order-status-update",
  [PosAuthentication, connectTenantDB],
  UpdateOrder
);

router.post(
  "/aurora-terminal-transaction-status",
  [PosAuthentication, connectTenantDB],
  GetPaymentStatus
);

router.post(
  "/aurora-terminal-transaction-cancel",
  [PosAuthentication, connectTenantDB],
  CancelPayment
);

router.get(
  "/aurora-list-terminals",
  [PosAuthentication, connectTenantDB],
  ListAllTerminals
);

router.post(
  "/aurora-reset-terminals",
  [PosAuthentication, connectTenantDB],
  ResetTerminal
);

router.post(
  "/aurora-terminal-create-refund",
  [PosAuthentication, connectTenantDB],
  RefundPayment
);

router.post("/jagopos-pos-create-code", CreatedCode);

router.post(
  "/jagopos-pos-get-code",
  [PosAuthentication, connectTenantDB],
  GetCode
);

module.exports = router;
