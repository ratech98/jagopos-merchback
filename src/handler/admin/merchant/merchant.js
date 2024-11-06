const {
  StoreSchema,
  CategorySchema,
  ClerkSchema,
  ItemSchema,
  CreateOrderSchema,
} = require("../../../models/common");

const MerchantSchema = require("../../../models/merchant");
const AdminSchema = require("../../../models/admin");

const jwt = require("jsonwebtoken");
const { Json } = require("../../../utils/translate/admin");
const { Bucket } = require("../../../utils/translate/bucket");

const { deleteStore } = require("../../merchant/store/store");
const { deleteClerk } = require("../../merchant/clerk/clerk");
const { deleteCategory } = require("../../merchant/category/category");
const { deleteItem } = require("../../merchant/item/item");
const { UploadImage, DeleteImage } = require("../../../utils/image-upload");
const {
  createDatabase,
  AdminconnectTenantDB,
  renameDatabase,
} = require("../../../config");
const {
  generateUrl,
} = require("../../../utils/db-url-generate/db-url-generate");

// const {Storage} = require('@google-cloud/storage');

// const projectId = process.env._PROJECT_ID;
// const keyFilename = process.env._KEYFILENAME;

// const storage = new Storage({
//   projectId,
//   keyFilename
// });

// const bb = await storage.bucket("tester").delete();

exports.addMerchant = async (req) => {
  const { id } = req;
  const { full_logo, small_logo } = req.files || {};

  const {
    merchant_name,
    merchant_phone_number,
    merchant_street,
    merchant_city,
    merchant_state,
    merchant_zip_code,
    contact_name,
    contact_phone_number,
    contact_street,
    contact_city,
    contact_state,
    contact_zip_code,
    pricing,
    add_method,
  } = req.body;

  const generatedURL = generateUrl(`db-001-${merchant_phone_number}`);

  const bodyData = {
    merchant_name,
    merchant_phone_number,
    merchant_street,
    merchant_city,
    merchant_state,
    merchant_zip_code,
    contact_name,
    contact_phone_number,
    contact_street,
    contact_city,
    contact_state,
    contact_zip_code,
    pricing,
    add_method,
    db_uri: generatedURL,
  };

  try {
    const admin = await AdminSchema.findOne({ admin_id: id });

    if (!admin) {
      return {
        responseCode: 403,
        resultCode: Json.admin.error.token_error.resultCode,
        success: false,
        message: Json.admin.error.token_error.message,
      };
    }

    const getMerchant = await MerchantSchema.create(bodyData);
    await createDatabase({
      name: `db-001-${getMerchant.merchant_phone_number}`,
      dburi: getMerchant.db_uri,
    });

    const imagePath = `${Bucket.path}${merchant_name}/logos/full_logo.jpg`;
    const imagePath2 = `${Bucket.path}${merchant_name}/logos/small_logo.jpg`;

    if (full_logo) {
      const FULL = await UploadImage({
        file: full_logo.data,
        imagePath: imagePath,
      });
      await MerchantSchema.updateOne(
        { _id: getMerchant._id },
        {
          bussiness_logo: {
            full_logo: FULL,
            small_logo:
              getMerchant.bussiness_logo.small_logo !== ""
                ? getMerchant.bussiness_logo.small_logo
                : "",
          },
        }
      );
    }
    if (small_logo) {
      const SMALL = await UploadImage({
        file: small_logo.data,
        imagePath: imagePath2,
      });
      const currentMerchant = await MerchantSchema.findOne({
        _id: getMerchant._id,
      });
      await MerchantSchema.updateOne(
        { _id: getMerchant._id },
        {
          bussiness_logo: {
            full_logo:
              currentMerchant.bussiness_logo.full_logo !== ""
                ? currentMerchant.bussiness_logo.full_logo
                : "",
            small_logo: SMALL,
          },
        }
      );
    }

    return {
      responseCode: 201,
      success: true,
      resultCode: Json.merchant.success.add_merchant.resultCode,
      message: Json.merchant.success.add_merchant.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.add_merchant.resultCode,
      message: Json.merchant.error.add_merchant.message,
      db_error: error.message,
    };
  }
};

exports.getAllMerchant = async (req) => {
  const { page = 1, limit = 10 } = req.query;
  const { id } = req;

  try {
    // Check if the admin exists
    const admin = await AdminSchema.findOne({ admin_id: id });

    if (!admin) {
      return {
        responseCode: 403,
        resultCode: Json.admin.error.token_error.resultCode,
        success: false,
        message: Json.admin.error.token_error.message,
      };
    }

    const setDefaultPage = Number(page);
    const setDefaultPageLimit = Number(limit);

    const totalDocuments = await MerchantSchema.countDocuments();
    const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);
    const allMerchant = await MerchantSchema.find()
      .select("-createdAt -updatedAt -__v")
      .skip((setDefaultPage - 1) * setDefaultPageLimit)
      .limit(setDefaultPageLimit)
      .lean();

    const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
    const endRow = startRow + allMerchant.length - 1;

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.merchant.success.all_merchant.resultCode,
      message: Json.merchant.success.all_merchant.message,
      data: allMerchant,
      currentPage: setDefaultPage,
      totalPages,
      limit: setDefaultPageLimit,
      totalCount: totalDocuments,
      showingRow: `${startRow} - ${endRow}`,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.all_merchant.resultCode,
      message: Json.merchant.error.all_merchant.message,
      db_error: error.message,
    };
  }
};

exports.getMerchant = async (req) => {
  const { id } = req;
  const { merchant_id } = req.body;

  try {
    const admin = await AdminSchema.findOne({ admin_id: id });

    if (!admin) {
      return {
        responseCode: 403,
        resultCode: Json.admin.error.token_error.resultCode,
        success: false,
        message: Json.admin.error.token_error.message,
      };
    }

    const merchant = await MerchantSchema.findOne({ _id: merchant_id }).select(
      "-createdAt -updatedAt -__v"
    );

    if (merchant) {
      return {
        responseCode: 200,
        resultCode: Json.merchant.success.get_merchant.resultCode,
        success: true,
        message: Json.merchant.success.get_merchant.message,
        data: merchant,
      };
    } else {
      return {
        responseCode: 500,
        resultCode: Json.merchant.error.get_merchant.resultCode,
        success: false,
        message: Json.merchant.error.get_merchant.message,
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.get_merchant.resultCode,
      message: Json.merchant.error.get_merchant.message,
      db_error: error.message,
    };
  }
};

exports.updateMerchant = async (req) => {
  const { id } = req;
  const {
    merchant_id,
    merchant_name,
    merchant_phone_number,
    merchant_street,
    merchant_city,
    merchant_state,
    merchant_zip_code,
    contact_name,
    contact_phone_number,
    contact_street,
    contact_city,
    contact_state,
    contact_zip_code,
    pricing,
  } = req.body;

  const { full_logo, small_logo } = req.files || {};

  try {
    const admin = await AdminSchema.findOne({ admin_id: id });
    const defaultLargeImage = Bucket.default_merchant_full_logo;

    const defaultSmallImage = Bucket.default_merchant_small_logo;

    if (!admin) {
      return {
        responseCode: 403,
        resultCode: Json.admin.error.token_error.resultCode,
        success: false,
        message: Json.admin.error.token_error.message,
      };
    }

    const merchant = await MerchantSchema.findById(merchant_id).select(
      "-createdAt -updatedAt -__v"
    );

    if (!merchant) {
      return {
        responseCode: 500,
        resultCode: Json.merchant.error.update_merchant.resultCode,
        success: false,
        message: Json.merchant.error.update_merchant.message1,
      };
    }

    let FullLogo = null;
    let SmallLogo = null;

    const imagePath = `${Bucket.path}${merchant.merchant_name}/logos/full_logo.jpg`;
    const imagePath2 = `${Bucket.path}${merchant.merchant_name}/logos/small_logo.jpg`;

    const extractText = (url) => {
      const match = url.match(/\/([^\/]+)\.jpg$/);
      return match ? match[1] : null;
    };

    if (full_logo) {
      if (
        merchant?.bussiness_logo?.full_logo !== "" &&
        defaultLargeImage !== merchant?.bussiness_logo?.full_logo
      ) {
        const deletePath = `${Bucket.path}${
          merchant.merchant_name
        }/logos/${extractText(merchant.bussiness_logo.full_logo)}.jpg`;

        if (merchant.bussiness_logo.full_logo !== "") {
          await DeleteImage({ imagePath: deletePath });
        }
      }

      const FULL = await UploadImage({
        file: full_logo.data,
        imagePath: imagePath,
      });

      FullLogo = FULL;
    }

    if (small_logo) {
      if (
        merchant?.bussiness_logo?.small_logo !== "" &&
        defaultSmallImage !== merchant?.bussiness_logo?.small_logo
      ) {
        const deletePath = `${Bucket.path}${
          merchant.merchant_name
        }/logos/${extractText(merchant.bussiness_logo.small_logo)}.jpg`;

        if (merchant.bussiness_logo.small_logo) {
          await DeleteImage({ imagePath: deletePath });
        }
      }

      const SMALL = await UploadImage({
        file: small_logo.data,
        imagePath: imagePath2,
      });

      SmallLogo = SMALL;
    }

    await MerchantSchema.findByIdAndUpdate(merchant_id, {
      merchant_name,
      merchant_street,
      merchant_city,
      merchant_state,
      merchant_zip_code,
      merchant_phone_number,
      contact_name,
      contact_phone_number,
      contact_street,
      contact_city,
      contact_state,
      contact_zip_code,
      pricing,
      bussiness_logo: {
        full_logo: FullLogo ? FullLogo : merchant.bussiness_logo.full_logo,
        small_logo: SmallLogo ? SmallLogo : merchant.bussiness_logo.small_logo,
      },
    });

    // if (merchant.merchant_phone_number !== merchant_phone_number) {
    //   const { success } = await renameDatabase({
    //     oldDbName: `db-001-${merchant.merchant_phone_number}`,
    //     newDbName: `db-001-${merchant_phone_number}`,
    //     url: merchant.db_uri,
    //   });

    //   if (success) {
    //     const generatedURL = generateUrl(merchant_phone_number);

    //     await MerchantSchema.findByIdAndUpdate(merchant_id, {
    //       db_uri: generatedURL,
    //     });
    //   }
    // }

    return {
      responseCode: 200,
      resultCode: Json.merchant.success.update_merchant.resultCode,
      success: true,
      message: Json.merchant.success.update_merchant.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.update_merchant.resultCode,
      message: Json.merchant.error.update_merchant.message,
      db_error: error.message,
    };
  }
};

exports.deleteMerchant = async (req) => {
  const { id } = req;
  const { merchant_id } = req.body;

  const defaultLargeImage = Bucket.default_merchant_full_logo;

  const defaultSmallImage = Bucket.default_merchant_small_logo;

  try {
    const admin = await AdminSchema.findOne({ admin_id: id });

    if (!admin) {
      return {
        responseCode: 403,
        resultCode: Json.admin.error.token_error.resultCode,
        success: false,
        message: Json.admin.error.token_error.message,
      };
    }

    const merchant = await MerchantSchema.findOne({ _id: merchant_id });

    const { dburi } = await AdminconnectTenantDB(merchant._id);

    const Storeschema = await dburi.model("stores", StoreSchema.schema);
    const Clerkschema = await dburi.model("clerks", ClerkSchema.schema);
    const Categoryschema = await dburi.model(
      "categories",
      CategorySchema.schema
    );
    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );
    const Itemschema = await dburi.model("items", ItemSchema.schema);

    if (merchant) {
      const findStores = await Storeschema.find({ merchant_id });

      if (findStores.length > 0) {
        for (const store of findStores) {
          const clerks = await Clerkschema.find({ store_id: store._id });
          const categories = await Categoryschema.find({ store_id: store._id });
          const createOrders = await CreateOrderschema.find({
            store_id: store._id,
          });

          const [clerksResult, categoriesResult, createOrdersResult] =
            await Promise.all([clerks, categories, createOrders]);

          // Delete clerks
          if (clerksResult.length > 0) {
            await Promise.all(
              clerksResult.map((clerk) => {
                const clerkObject = {
                  id: merchant_id,
                  dburi,
                  body: { clerk_id: clerk._id },
                };
                return deleteClerk(clerkObject);
              })
            );
          }

          // Delete items and categories
          if (categoriesResult.length > 0) {
            for (const category of categoriesResult) {
              const items = await Itemschema.find({
                category_id: category._id,
              });

              if (items.length > 0) {
                await Promise.all(
                  items.map((item) => {
                    const itemObject = {
                      id: merchant_id,
                      dburi,
                      body: { item_id: item._id },
                    };
                    return deleteItem(itemObject);
                  })
                );
              }

              const categoryObject = {
                id: merchant_id,
                dburi,
                body: { category_id: category._id },
              };
              await deleteCategory(categoryObject);
            }
          }

          // Delete orders
          if (createOrdersResult.length > 0) {
            await Promise.all(
              createOrdersResult.map((order) =>
                CreateOrderschema.deleteOne({ _id: order._id })
              )
            );
          }

          // Delete store
          const deletStoreobject = {
            id: merchant_id,
            dburi,
            body: { store_id: store._id },
          };
          await deleteStore(deletStoreobject);
        }
      }

      // Extract image paths for deletion
      const extractText = (url) => {
        const match = url.match(/\/([^\/]+)\.jpg$/);
        return match ? match[1] : null;
      };

      if (
        merchant.bussiness_logo.full_logo !== "" &&
        defaultLargeImage !== merchant.bussiness_logo.full_logo
      ) {
        const largeImage = `${Bucket.path}${
          merchant.merchant_name
        }/logos/${extractText(merchant.bussiness_logo.full_logo)}.jpg`;
        await DeleteImage({ imagePath: largeImage });
      }

      if (
        merchant.bussiness_logo.small_logo !== "" &&
        defaultSmallImage !== merchant.bussiness_logo.small_logo
      ) {
        const smallImage = `${Bucket.path}${
          merchant.merchant_name
        }/logos/${extractText(merchant.bussiness_logo.small_logo)}.jpg`;

        await DeleteImage({ imagePath: smallImage });
      }
      // Delete images

      // Delete merchant
      await MerchantSchema.deleteOne({ _id: merchant_id });

      return {
        responseCode: 200,
        resultCode: Json.merchant.success.delete_merchant.resultCode,
        success: true,
        message: Json.merchant.success.delete_merchant.message,
      };
    } else {
      return {
        responseCode: 500,
        resultCode: Json.merchant.error.delete_merchant.resultCode,
        success: false,
        message: Json.merchant.error.delete_merchant.message1,
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.delete_merchant.resultCode,
      message: Json.merchant.error.delete_merchant.message,
      db_error: error.message,
    };
  }
};

exports.merchantToken = async (req) => {
  const { merchant_id } = req.body;

  try {
    const merchant = await MerchantSchema.findById(merchant_id).select(
      "-createdAt -updatedAt -__v"
    );

    if (!merchant) {
      return {
        responseCode: 403,
        resultCode: Json.merchant.error.token_merchant.resultCode,
        success: false,
        message: Json.merchant.error.token_merchant.message,
      };
    }

    const token = await jwt.sign(
      { id: merchant._id },
      process.env._JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.merchant.success.merchant_token.resultCode,
      message: Json.merchant.success.merchant_token.message,
      token,
    };
  } catch (error) {
    return {
      responseCode: 403,
      resultCode: Json.merchant.error.token_merchant.resultCode,
      success: false,
      message: Json.merchant.error.token_merchant.message,
      db_error: error.message,
    };
  }
};
