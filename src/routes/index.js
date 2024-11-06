const router = require("express").Router();

const merchantDashboard = require("./merchant");
const adminDashboard = require("./admin");
const POS = require("./pos");
const KDS = require("./kds");
const webOrders = require("./web-orders");
const token = require("./token");
const mobileorders=require("./mobile-order")

router.use("/v1", merchantDashboard);
router.use("/v1", adminDashboard);
router.use("/v1", POS);
router.use("/v1", KDS);
router.use("/v1", webOrders);
router.use("/v1", token);
router.use("/v1",mobileorders)



module.exports = router;
