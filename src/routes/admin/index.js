const router = require("express").Router();

//Merchant routes
const {
  AddMerchant,
  AllMerchant,
  GetMerchant,
  UpdateMerchant,
  DeleteMerchant,
  MerchantToken,
} = require("../../controller/admin/merchant/merchant");

const {
  GetAdminDetails,
  Login,
  VerifyOTP,
  ResendOTP
} = require("../../controller/admin/authentication/authentication");

const {
  AddURL,
  GetURL,
} = require("../../controller/admin/web-order/web-order");

//MiddleWare
const { Authentication } = require("../../middleware/authentication");

//Authentication
router.post("/jagopos-admin-login", Login);
router.post("/jagopos-admin-resend-otp", ResendOTP);

router.post("/jagopos-admin-verify-otp", [Authentication], VerifyOTP);
router.get("/jagopos-admin-get-admin", [Authentication], GetAdminDetails);

//Merchant routes
router.get("/jagopos-admin-get-all-merchants", [Authentication], AllMerchant);
router.post("/jagopos-admin-add-merchant", [Authentication], AddMerchant);
router.post("/jagopos-admin-get-merchant", [Authentication], GetMerchant);
router.post("/jagopos-admin-merchant-token", [Authentication], MerchantToken);
router.put("/jagopos-admin-upadate-merchant", [Authentication], UpdateMerchant);
router.delete(
  "/jagopos-admin-delete-merchant",
  [Authentication],
  DeleteMerchant
);

router.get("/jagopos-admin-get-domain", [Authentication], GetURL);
router.post("/jagopos-admin-add-domain", [Authentication], AddURL);

module.exports = router;
