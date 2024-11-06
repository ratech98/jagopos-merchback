const router = require("express").Router();

const {
  GetStoreItems,
  GenerateToken,
  CreateOrder,
  RefundPayment,
} = require("../../controller/web-orders/web-orders");

const { WebOrder } = require("../../middleware/authentication");

router.get("/jagopos-web-orders-generate-token", GenerateToken);
router.get("/jagopos-web-orders-get-all-items", [WebOrder], GetStoreItems);
router.post("/jagopos-web-orders-create-order", [WebOrder], CreateOrder);

router.post("/aurora-create-refund", [WebOrder], RefundPayment);

module.exports = router;
