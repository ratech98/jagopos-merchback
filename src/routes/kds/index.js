const router = require("express").Router();

const {
  Login,
  VerifyOTP,
  ClerkLogin,
  ResendOTP,
  CreateCode,
  GetCode,
} = require("../../controller/kds/authentication/authentication");

const {
  GetOrdersClosed,
  GetOrdersOpened,
  UpdateOrder,
  CloseOrder,
  Recall,
  Front,
} = require("../../controller/kds/order/orders");

const { GetStores } = require("../../controller/kds/store/store");

const {
  Authentication,
  PosAuthentication,
} = require("../../middleware/authentication");
const { connectTenantDB } = require("../../config");

//authentication
router.post("/jagopos-kds-merchant-login", Login);
router.post("/jagopos-kds-merchant-resendotp", ResendOTP);
router.post("/jagopos-kds-verify-otp", [Authentication], VerifyOTP);
router.post(
  "/jagopos-kds-clerk-login",
  [PosAuthentication, connectTenantDB],
  ClerkLogin
);

router.post(
  "/jagopos-kds-get-closed-orders",
  [PosAuthentication, connectTenantDB],
  GetOrdersClosed
);
router.post(
  "/jagopos-kds-get-opened-orders",
  [PosAuthentication, connectTenantDB],
  GetOrdersOpened
);
router.post(
  "/jagopos-kds-close-all-orders",
  [PosAuthentication, connectTenantDB],
  CloseOrder
);
router.post(
  "/jagopos-kds-recall",
  [PosAuthentication, connectTenantDB],
  Recall
);
router.post("/jagopos-kds-front", [PosAuthentication, connectTenantDB], Front);

router.put(
  "/jagopos-kds-update-order",
  [PosAuthentication, connectTenantDB],
  UpdateOrder
);

//Get all Stores
router.get(
  "/jagopos-kds-all-stores",
  [Authentication, connectTenantDB],
  GetStores
);

router.post("/jagopos-kds-create-code", CreateCode);

router.post(
  "/jagopos-kds-get-code",
  [PosAuthentication, connectTenantDB],
  GetCode
);

module.exports = router;
