const {
  CategorySchema,
  ItemSchema,
  StoreSchema,
} = require("../../../models/common");
const MerchantSchema = require("../../../models/merchant");


const { Json } = require("../../../utils/translate/merchant");
const { Bucket } = require("../../../utils/translate/bucket");


const { UploadImage, DeleteImage } = require("../../../utils/image-upload");

exports.addBulkData = async (req) => {
  const { id, dburi } = req;
  const {
    item_name,
    item_price,
    item_description,
    subItem,
    category,
    store_id,
  } = req.body;
  const parsedSubItem = JSON.parse(subItem);
  const Storeschema = await dburi.model("stores", StoreSchema.schema);
  const Categoryschema = await dburi.model("categories", CategorySchema.schema);
  const Itemschema = await dburi.model("items", ItemSchema.schema);

  try {
    const store = await Storeschema.findById(store_id);

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.bulk_upload.error.store.resultCode,
        message: Json.bulk_upload.error.store.message,
      };
    }

    const findCategory = await Categoryschema.findOne({
      category_name: category,
      store_id,
    });

    if (!findCategory) {
      const data = {
        merchant_id: id,
        store_id,
        category_name: category,
      };
      await Categoryschema.create(data);
    }

    if (!findCategory) {
      const findCategory = await Categoryschema.findOne({
        category_name: category,
        store_id,
      });

      const itemBodyData = {
        item_name,
        item_price: parseFloat(item_price).toFixed(2),
        item_description,
        subItem: parsedSubItem ? parsedSubItem : [],
        store_id,
        category_id: findCategory._id,
        merchant_id: id,
      };
      await Itemschema.create(itemBodyData);

      const item = {
        name: item_name,
        category,
      };

      return {
        success: true,
        responseCode: 201,
        resultCode: Json.bulk_upload.success.uploaded.resultCode,
        message: Json.bulk_upload.success.uploaded.message,
        data: item,
      };
    } else {
      const itemBodyData = {
        item_name,
        item_price: parseFloat(item_price).toFixed(2),
        item_description,
        subItem: parsedSubItem ? parsedSubItem : [],
        store_id,
        category_id: findCategory._id,
        merchant_id: id,
      };
      await Itemschema.create(itemBodyData);

      const item = {
        name: item_name,
        category,
      };

      return {
        success: true,
        responseCode: 201,
        resultCode: Json.bulk_upload.success.uploaded.resultCode,
        message: Json.bulk_upload.success.uploaded.message,
        data: item,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 400,
      resultCode: Json.bulk_upload.error.uploaded.resultCode,
      message: Json.bulk_upload.error.uploaded.message,
      db_error: error.message,
    };
  }
};

exports.removeAll = async (req) => {
  const { id, dburi } = req;
  const { store_id } = req.body;
  const Storeschema = await dburi.model("stores", StoreSchema.schema);
  const Categoryschema = await dburi.model("categories", CategorySchema.schema);
  const Itemschema = await dburi.model("items", ItemSchema.schema);

  const defaultImage = Bucket.default_item_image
  try {
    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.bulk_upload.error.token.resultCode,
        message: Json.bulk_upload.error.token.message,
      };
    }

    const store = await Storeschema.findById(store_id);

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.bulk_upload.error.store.resultCode,
        message: Json.bulk_upload.error.store.message,
      };
    }

    const findItems = await Itemschema.find({ store_id: store_id });

    await Promise.all(
      findItems.map(async (item) => {
        if (defaultImage !== item.item_image) {
          const extractText = (url) => {
            const match = url.match(/\/([^\/]+)\.jpg$/);
            return match ? match[1] : null;
          };
          const deletePath = `${Bucket.path}${
            merchant.merchant_name
          }/stores/${store.store_name}/items/${extractText(
            item.item_image
          )}.jpg`;
          await DeleteImage({ imagePath: deletePath });
        }
        await Itemschema.findByIdAndDelete(item._id);
      })
    );

    const findCategory = await Categoryschema.find({ store_id: store_id });

    await Promise.all(
      findCategory.map(async (item) => {
        if (
          item.category_image !== "" &&
          defaultImage !== item.category_image
        ) {
          const extractText = (url) => {
            const match = url.match(/\/([^\/]+)\.jpg$/);
            return match ? match[1] : null;
          };
          const deletePath = `${Bucket.path}${
            merchant.merchant_name
          }/stores/${store.store_name}/categories/${extractText(
            item.category_image
          )}.jpg`;
          await DeleteImage({ imagePath: deletePath });
        }
        await Categoryschema.findByIdAndDelete(item._id);
      })
    );

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.bulk_upload.success.removeAll.resultCode,
      message: Json.bulk_upload.success.removeAll.message,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 400,
      resultCode: Json.bulk_upload.error.removeAll.resultCode,
      message: Json.bulk_upload.error.removeAll.message,
      db_error: error.message,
    };
  }
};

exports.bulkImageUpload = async (req) => {
  const { id, dburi } = req;
  const { store_id, category, item_name } = req.body;
  const fileImage = req?.files?.image;
  const Storeschema = await dburi.model("stores", StoreSchema.schema);
  const Categoryschema = await dburi.model("categories", CategorySchema.schema);
  const Itemschema = await dburi.model("items", ItemSchema.schema);
  const defaultImage = Bucket.default_item_image

  try {
    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.bulk_upload.error.token.resultCode,
        message: Json.bulk_upload.error.token.message,
      };
    }

    const store = await Storeschema.findById(store_id);

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.bulk_upload.error.store.resultCode,
        message: Json.bulk_upload.error.store.message,
      };
    }

    const findCategory = await Categoryschema.findOne({
      category_name: category,
      store_id,
    });

    if (!findCategory) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.bulk_upload.error.bulkImageUpload.resultCode,
        message: `Category is not available ${findCategory.category_name}`,
      };
    }

    const findItem = await Itemschema.findOne({
      category_id: findCategory._id,
      item_name,
      store_id,
    });

    if (!findItem) {
      return {
        success: false,
        responseCode: 400,
        resultCode: Json.bulk_upload.error.bulkImageUpload.resultCode,
        message: `Invalid Item ${findCategory.category_name}_${findItem.item_name}`,
      };
    }

    if (findItem) {
      if (defaultImage !== findItem.item_image) {
        const extractText = (url) => {
          const match = url.match(/\/([^\/]+)\.jpg$/);
          return match ? match[1] : null;
        };
        const deletePath = `${Bucket.path}${
          merchant.merchant_name
        }/stores/${store.store_name}/items/${extractText(
          findItem.item_image
        )}.jpg`;
        await DeleteImage({ imagePath: deletePath });
      }

      const imagePath = `${Bucket.path}${merchant.merchant_name}/stores/${store.store_name}/items/${category}_${item_name}.jpg`;

      let img = null;

      if (fileImage) {
        const Image = await UploadImage({
          file: fileImage.data,
          imagePath: imagePath,
        });
        img = Image;
      }

      const update = await Itemschema.findOneAndUpdate(
        { category_id: findCategory._id, item_name, store_id },
        {
          item_image: img ? img : defaultImage,
        },
        { new: true }
      );

      const item = {
        name: update.item_name,
        category: category,
      };

      return {
        success: true,
        responseCode: 201,
        resultCode: Json.bulk_upload.success.uploaded.resultCode,
        message: Json.bulk_upload.success.uploaded.message,
        data: item,
      };
    }
  } catch (error) {
    return {
      success: false,
      responseCode: 400,
      resultCode: Json.bulk_upload.error.uploaded.resultCode,
      message: Json.bulk_upload.error.uploaded.message,
      db_error: error.message,
    };
  }
};
