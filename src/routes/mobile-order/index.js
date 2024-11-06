const router = require("express").Router();

const {
  GetStoreItems,
} = require("../../controller/web-orders/web-orders");
const {
    CreateOrder,
}=require("../../controller/mobile-orders/order/order")
const {
    GetStores
}=require("../../controller/mobile-orders/store/store")

router.get("/jagopos-mobile-orders-get-all-items", GetStoreItems);
router.post("/jagopos-mobile-orders-create-order", CreateOrder);
router.post("/jagopos-merchant-get-all-stores-mobile-orders", GetStores);



module.exports = router;
