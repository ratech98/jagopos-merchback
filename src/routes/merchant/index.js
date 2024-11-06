const router = require("express").Router();

//Merchant routes
const {
  AddMerchant,
  GetMerchant,
  UpdateMerchant,
} = require("../../controller/merchant/merchant/merchant");

//Authentication
const {
  Login,
  VerifyOTP,
  ResendOTP,
} = require("../../controller/merchant/authentication/authentication");

//Store
const {
  AddStore,
  DeleteStore,
  GetStore,
  GetStores,
  UpdateStore,
} = require("../../controller/merchant/store/store");

//Category
const {
  AddCategory,
  UpdateCategory,
  GetCategory,
  DeleteCategory,
  GetCategories,
  UpdateCategoryStatus,
  GetAllCategories,
} = require("../../controller/merchant/category/category");

//Items
const {
  AddItem,
  DeleteItem,
  GetItem,
  GetItems,
  UpdateItem,
  StatusChangeItem,
  GetAllItems,
} = require("../../controller/merchant/item/item");

//Clerk
const {
  AddClerk,
  UpdateClerk,
  GetClerk,
  GetClerks,
  DeleteClerk,
  StatusChangeClerk,
} = require("../../controller/merchant/clerk/clerk");

//Bulk
const {
  BulkDataUpload,
  RemoveAll,
  BulkImageUpload,
} = require("../../controller/merchant/bulk/bulk-data-upload");

const {
  GetOrders,
  CancelPayment,
  CompletedOrder,
} = require("../../controller/merchant/orders/orders");

const {
  CreateKdsDevice,
  CreatePosDevice,
  CreateTokenDevice,
  DeleteDevice,
  GetDevices,
} = require("../../controller/merchant/devices/devices");

//MiddleWare
const { Authentication } = require("../../middleware/authentication");
const { connectTenantDB } = require("../../config");

//Merchant routes
router.post("/jagopos-merchant-add-merchant", AddMerchant);
router.post("/jagopos-merchant-login", Login);
router.post("/jagopos-merchant-resend-otp", ResendOTP);

router.post("/jagopos-merchant-verify-otp", [Authentication], VerifyOTP);
router.get("/jagopos-merchant-get-merchant", [Authentication], GetMerchant);
router.put(
  "/jagopos-merchant-update-merchant",
  [Authentication],
  UpdateMerchant
);

//Store routes
router.get("/jagopos-merchant-get-all-stores", [connectTenantDB], GetStores);
router.post("/jagopos-merchant-add-store", [connectTenantDB], AddStore);
router.post("/jagopos-merchant-get-store", [connectTenantDB], GetStore);
router.put("/jagopos-merchant-update-store", [connectTenantDB], UpdateStore);
router.delete("/jagopos-merchant-delete-store", [connectTenantDB], DeleteStore);

//Category routes
router.post(
  "/jagopos-merchant-get-all-categories",
  [connectTenantDB],
  GetCategories
);
router.post(
  "/jagopos-merchant-get-categories",
  [connectTenantDB],
  GetAllCategories
);
router.post("/jagopos-merchant-add-category", [connectTenantDB], AddCategory);
router.post("/jagopos-merchant-get-category", [connectTenantDB], GetCategory);
router.put(
  "/jagopos-merchant-update-category-status",
  [connectTenantDB],
  UpdateCategoryStatus
);
router.put(
  "/jagopos-merchant-update-category",
  [connectTenantDB],
  UpdateCategory
);
router.delete(
  "/jagopos-merchant-delete-category",
  [connectTenantDB],
  DeleteCategory
);

//Items routes
router.post("/jagopos-merchant-get-all-items", [connectTenantDB], GetItems);
router.post("/jagopos-merchant-get-items", [connectTenantDB], GetAllItems);
router.post("/jagopos-merchant-add-item", [connectTenantDB], AddItem);
router.post("/jagopos-merchant-get-item", [connectTenantDB], GetItem);
router.put("/jagopos-merchant-update-item", [connectTenantDB], UpdateItem);
router.put(
  "/jagopos-merchant-status-change-item",
  [connectTenantDB],
  StatusChangeItem
);
router.delete("/jagopos-merchant-delete-item", [connectTenantDB], DeleteItem);

//Clerk routes
router.post("/jagopos-merchant-get-all-clerks", [connectTenantDB], GetClerks);
router.post("/jagopos-merchant-add-clerk", [connectTenantDB], AddClerk);
router.post("/jagopos-merchant-get-clerk", [connectTenantDB], GetClerk);
router.put("/jagopos-merchant-update-clerk", [connectTenantDB], UpdateClerk);
router.put(
  "/jagopos-merchant-status-change-clerk",
  [connectTenantDB],
  StatusChangeClerk
);
router.delete("/jagopos-merchant-delete-clerk", [connectTenantDB], DeleteClerk);

//Bulk routes
router.post(
  "/jagopos-merchant-bulk-data-upload",
  [connectTenantDB],
  BulkDataUpload
);
router.post(
  "/jagopos-merchant-bulk-image-upload",
  [connectTenantDB],
  BulkImageUpload
);
router.post("/jagopos-merchant-remove-all", [connectTenantDB], RemoveAll);

//Orders routes
router.post("/jagopos-merchant-get-orders", [connectTenantDB], GetOrders);
router.post("/jagopos-merchant-cancel-order", [connectTenantDB], CancelPayment);
router.post(
  "/jagopos-merchant-complete-order",
  [connectTenantDB],
  CompletedOrder
);

//Devices routes
router.post(
  "/jagopos-merchant-create-pos-device",
  [connectTenantDB],
  CreatePosDevice
);
router.post(
  "/jagopos-merchant-create-kds-device",
  [connectTenantDB],
  CreateKdsDevice
);
router.post(
  "/jagopos-merchant-create-token-device",
  [connectTenantDB],
  CreateTokenDevice
);
router.post("/jagopos-merchant-get-devices", [connectTenantDB], GetDevices);
router.post("/jagopos-merchant-delete-device", [connectTenantDB], DeleteDevice);

module.exports = router;
