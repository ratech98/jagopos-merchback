const {
  StoreSchema,
  CategorySchema,
  ClerkSchema,
  ItemSchema,
  CreateOrderSchema,
} = require("../../../models/common");

const MerchantSchema = require("../../../models/merchant");
const AdminSchema = require("../../../models/admin");



const { Json } = require("../../../utils/translate/merchant");
const { Bucket } = require("../../../utils/translate/bucket");

const { deleteClerk } = require("../../merchant/clerk/clerk");
const { deleteCategory } = require("../../merchant/category/category");
const { deleteItem } = require("../../merchant/item/item");

const { UploadImage, DeleteImage } = require("../../../utils/image-upload");

const axios = require("axios");

async function getLatLng(address) {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address: address,
        key: process.env._GOOGLE_MAP_KEY,
      },
    }
  );

  if (response.data.status === "OK") {
    const location = response.data.results[0].geometry.location;
    return location;
  } else {
    console.log("Google Map error:", response.data);
  }
}

exports.addStore = async (req) => {
  const { id, dburi } = req;
  const {
    store_name,
    store_phone,
    store_street,
    store_city,
    store_state,
    store_zip_code,
  } = req.body;
  const { store_image } = req.files || {};
  const Storeschema = await dburi.model("stores", StoreSchema.schema);

  const bodyData = {
    merchant_id: id,
    store_name,
    store_phone,
    store_street,
    store_city,
    store_state,
    store_zip_code,
  };

  try {
    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.store.error.token_error.resultCode,
        message: Json.store.error.token_error.message,
      };
    }

    const address = `${store_street} ${store_city} ${store_state} ${store_zip_code}`;

    // Call the function
    const getlatlng = await getLatLng(address);

    bodyData.location = {
      latitude: getlatlng?.lat || "",
      longitude: getlatlng?.lng || "",
    };
    const merchantname = merchant.merchant_name;
    const formattedName = merchantname.replace(/\s+/g, "-");

    const storename = store_name;
    const formattedName1 = storename.replace(/\s+/g, "-");

    bodyData.store_token = `${formattedName}/${formattedName1}`;

    const response = await Storeschema.create(bodyData);

    const imagePath = `${Bucket.path}${merchant.merchant_name}/stores/${response.store_name}/logos/${response.store_name}.jpg`;

    if (store_image) {
      const Image = await UploadImage({
        file: store_image.data,
        imagePath: imagePath,
      });
      await Storeschema.updateOne(
        { _id: response._id },
        {
          store_image: Image,
        }
      );
    }

    return {
      success: true,
      responseCode: 201,
      resultCode: Json.store.success.add_store.resultCode,
      message: Json.store.success.add_store.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.store.error.add_store.resultCode,
      message: Json.store.error.add_store.message,
      db_error: error.message,
    };
  }
};

exports.getStores = async (req) => {
  const { id, dburi } = req;
  const { page = 1, limit = 10 } = req.query;
  const setDefaultPage = Number(page);
  const setDefaultPageLimit = Number(limit);

  const Storeschema = await dburi.model("stores", StoreSchema.schema);

  const getDomainLink = await AdminSchema.find();

  try {
    const totalDocuments = await Storeschema.countDocuments({
      merchant_id: id,
    });
    const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);
    const stores = await Storeschema.find({ merchant_id: id })
      .skip((setDefaultPage - 1) * setDefaultPageLimit)
      .limit(setDefaultPageLimit)
      .lean();

    const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
    const endRow = startRow + stores.length - 1;

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.store.success.get_store.resultCode,
      message: Json.store.success.get_store.message,
      data: stores,
      totalPages,
      currentPage: setDefaultPage,
      limit: setDefaultPageLimit,
      totalCount: totalDocuments,
      showingRow: `${startRow} - ${endRow}`,
      domainLink: getDomainLink?.[0]?.web_order_domain || "",
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.store.error.get_store.resultCode,
      message: Json.store.error.get_store.message,
      db_error: error.message,
    };
  }
};

exports.getStore = async (req) => {
  const { id, dburi } = req;
  const { store_id } = req.body;
  const Storeschema = await dburi.model("stores", StoreSchema.schema);

  try {
    const store = await Storeschema.findOne({ _id: store_id });
    if (!store) {
      return {
        success: false,
        responseCode: 404,
        resultCode: Json.store.error.get_store.resultCode,
        message: Json.store.error.get_store.message1,
      };
    }

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.store.success.get_store.resultCode,
      message: Json.store.success.get_store.message,
      data: store,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.store.error.get_store.resultCode,
      message: Json.store.error.get_store.message,
      db_error: error.message,
    };
  }
};

exports.updateStore = async (req) => {
  const { id, dburi } = req;
  const {
    store_id,
    store_name,
    store_phone,
    store_street,
    store_city,
    store_state,
    store_zip_code,
  } = req.body;
  const { store_image } = req.files || {};

  const defaultImage = Bucket.default_store_image
  const Storeschema = await dburi.model("stores", StoreSchema.schema);

  try {
    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.store.error.token_error.resultCode,
        message: Json.store.error.token_error.message,
      };
    }

    const store = await Storeschema.findOne({ _id: store_id });
    if (store) {
      let uploadedLink = null;

      const imagePath = `${Bucket.path}${merchant.merchant_name}/stores/${store.store_name}/logos/${store.store_name}.jpg`;

      const extractText = (url) => {
        const match = url.match(/\/([^\/]+)\.jpg$/);
        return match ? match[1] : null;
      };
      const deletePath = `${Bucket.path}${
        merchant.merchant_name
      }/stores/${store.store_name}/logos/${extractText(store.store_image)}.jpg`;

      if (store_image) {
        if (store.store_image !== "" && defaultImage !== store.store_image) {
          await DeleteImage({ imagePath: deletePath });
        }

        const StoreImage = await UploadImage({
          file: store_image.data,
          imagePath: imagePath,
        });

        uploadedLink = StoreImage;
      }

      const merchantname = merchant.merchant_name;
      const formattedName = merchantname.replace(/\s+/g, "-");

      const storename = store_name;
      const formattedName1 = storename.replace(/\s+/g, "-");
      const address = `${store_street} ${store_city} ${store_state} ${store_zip_code}`;

      // Call the function
      const getlatlng = await getLatLng(address);

      const bodyData = {
        store_name,
        store_phone,
        store_street,
        store_city,
        store_state,
        store_zip_code,
        store_image: uploadedLink ? uploadedLink : store.store_image,
        store_token: `${formattedName}/${formattedName1}`,
        location: {
          latitude: getlatlng?.lat || "",
          longitude: getlatlng?.lng || "",
        },
      };

      console.log("bodyData", bodyData);

      await Storeschema.updateOne(
        {
          _id: store_id,
        },
        bodyData
      );
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.store.success.update_store.resultCode,
        message: Json.store.success.update_store.message,
      };
    } else {
      return {
        success: false,
        responseCode: 403,
        resultCode: Json.store.error.update_store.resultCode,
        message: Json.store.error.update_store.message1,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.store.error.update_store.resultCode,
      message: Json.store.error.update_store.message,
      db_error: error.message,
    };
  }
};

exports.deleteStore = async (req) => {
  const { id, dburi } = req;
  const { store_id } = req.body;
  const defaultImage = Bucket.default_store_image


  try {
    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.store.error.token_error.resultCode,
        message: Json.store.error.token_error.message,
      };
    }

    const extractText = (url) => {
      const match = url.match(/\/([^\/]+)\.jpg$/);
      return match ? match[1] : null;
    };

    const Storeschema = await dburi.model("stores", StoreSchema.schema);

    const store = await Storeschema.findById(store_id);

    if (store) {
      const clerkSchame = await dburi.model("clerks", ClerkSchema.schema);

      const categorySchema = await dburi.model(
        "categories",
        CategorySchema.schema
      );

      const createOrderSchema = await dburi.model(
        "orders",
        CreateOrderSchema.schema
      );

      const itemsSchema = await dburi.model("items", ItemSchema.schema);

      const clerks = await clerkSchame.find({ store_id: store._id });

      const categories = await categorySchema.find({ store_id: store._id });

      const createOrders = await createOrderSchema.find({
        store_id: store._id,
      });

      const [clerksResult, categoriesResult, createOrdersResult] =
        await Promise.all([clerks, categories, createOrders]);

      // Delete clerks
      if (clerksResult.length > 0) {
        console.log("clerksResult", clerksResult);

        await Promise.all(
          clerksResult.map((clerk) => {
            const clerkObject = {
              id: id,
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
          const items = await itemsSchema.find({
            category_id: category._id,
          });

          if (items.length > 0) {
            await Promise.all(
              items.map((item) => {
                const itemObject = {
                  id: id,
                  dburi,
                  body: { item_id: item._id },
                };
                return deleteItem(itemObject);
              })
            );
          }

          const categoryObject = {
            id: id,
            dburi,
            body: { category_id: category._id },
          };
          await deleteCategory(categoryObject);
        }
      }

      // Delete orders
      if (createOrdersResult.length > 0) {
        await Promise.all(
          createOrdersResult.map(
            async (order) =>
              await createOrderSchema.deleteOne({ _id: order._id })
          )
        );
      }

      if (
        store.store_image &&
        store.store_image !== "" &&
        defaultImage !== store.store_image
      ) {
        const deletePath = `${Bucket.path}${
          merchant.merchant_name
        }/stores/${store.store_name}/logos/${extractText(
          store.store_image
        )}.jpg`;
        await DeleteImage({ imagePath: deletePath });
      }
      await Storeschema.deleteOne({ _id: store_id });
      return {
        success: true,
        responseCode: 200,
        resultCode: Json.store.success.delete_store.resultCode,
        message: Json.store.success.delete_store.message,
      };
    } else {
      return {
        success: false,
        responseCode: 403,
        resultCode: Json.store.error.delete_store.resultCode,
        message: Json.store.error.delete_store.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.store.error.delete_store.resultCode,
      message: Json.store.error.delete_store.message,
      db_error: error.message,
    };
  }
};

