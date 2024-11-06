const express = require("express");

const router = express.Router();

const {
  CreateToken,
  GetCode,
  RemoveCode,
  CheckCode,
} = require("../../controller/token/create-token/create-token");
const {
  Login,
  Verify,
  ResendOTP,
  GetMerchant,
} = require("../../controller/token/authentication/authentication");

const {
  GetStores,
  UpdateTime
} = require("../../controller/token/stores/stores");
const {
  CreateTV,
  GetTV,
  GetOrders,
  DisconnectTV,
  EnableService,
} = require("../../controller/token/tv/token_tv");

const {
  CreateDevice,
  DisconnectDevice,
  GetDevice,
  UpdateTerminal,
} = require("../../controller/token/tv/device");

const {
  TerminalStatus,
} = require("../../controller/token/aurora-payments/payment");

const {
  Authentication,
  TokenAuthentication,
} = require("../../middleware/authentication");
const { connectTenantDB } = require("../../config");

//authentication
router.post("/jagopos-token-login", Login);
router.post("/jagopos-token-resend-otp", ResendOTP);

router.post("/jagopos-token-verify", [Authentication], Verify);

router.get("/jagopos-token-get-merchant", [Authentication], GetMerchant);

//Get all stores
router.get(
  "/jagopos-token-get-stores",
  [Authentication, connectTenantDB],
  GetStores
);

router.post(
  "/jagopos-token-update-time",
  [Authentication, connectTenantDB],
  UpdateTime
);





router.post(
  "/jagopos-token-create-token_tv",
  [Authentication, connectTenantDB],
  CreateTV
);
router.post(
  "/jagopos-token-get-token_tv",
  [Authentication, connectTenantDB],
  GetTV
);

router.get("/jagopos-token-get-orders", [TokenAuthentication], GetOrders);

router.post(
  "/jagopos-token-disconnect-tv",
  [Authentication, connectTenantDB],
  DisconnectTV
);

router.post(
  "/jagopos-token-enable-service",
  [Authentication, connectTenantDB],
  EnableService
);

//Token create
router.post("/jagopos-token-create-code", CreateToken);
router.post("/jagopos-token-get-code", GetCode);
router.post("/jagopos-token-remove-code", RemoveCode);
router.post("/jagopos-token-check-code", CheckCode);

//Device
router.post(
  "/jagopos-token-create-device",
  [Authentication, connectTenantDB],
  CreateDevice
);
router.post(
  "/jagopos-token-get-device",
  [Authentication, connectTenantDB],
  GetDevice
);
router.post(
  "/jagopos-token-disconnect-device",
  [Authentication, connectTenantDB],
  DisconnectDevice
);

router.post(
  "/jagopos-token-update-terminal",
  [Authentication, connectTenantDB],
  UpdateTerminal
);

router.post(
  "/aurora-terminal-status",
  [Authentication, connectTenantDB],
  TerminalStatus
);

module.exports = router;
