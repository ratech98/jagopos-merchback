const {
  CategorySchema,
  ItemSchema,  
  StoreSchema,
} = require("../../../models/common");

const MerchantSchema = require("../../../models/merchant");


const { Json } = require("../../../utils/translate/merchant");
const { Bucket } = require("../../../utils/translate/bucket");

const { UploadImage, DeleteImage } = require("../../../utils/image-upload");

exports.addItem = async (req) => {
  const { id, dburi } = req;
  const {
    category_id,
    item_name,
    item_price,
    item_description,
    subItem,
    store_id,
    merchant_id,
  } = req.body;

  const parsedSubItem = JSON.parse(subItem);

  const { item_image } = req.files || {};
  const Storeschema = await dburi.model("stores", StoreSchema.schema);
  const Categoryschema = await dburi.model("categories", CategorySchema.schema);
  const Itemschema = await dburi.model("items", ItemSchema.schema);

  try {
    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.token_error.resultCode,
        message: Json.item.error.token_error.message,
      };
    }

    const store = await Storeschema.findOne({ _id: store_id });

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.token_error.resultCode,
        message: Json.item.error.token_error.message1,
      };
    }

    const category = await Categoryschema.findOne({ _id: category_id });

    if (!category) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.add_item.resultCode,
        message: Json.item.error.add_item.message1,
      };
    }

    let img = null;

    if (item_image) {
      const imagePath = `${Bucket.path}${merchant.merchant_name}/stores/${store.store_name}/items/${category.category_name}_${item_name}.jpg`;
      const Image = await UploadImage({
        file: item_image.data,
        imagePath: imagePath,
      });

      img = Image;
    }

    const defaultImage = Bucket.default_item_image


    const bodyData = {
      merchant_id,
      category_id,
      item_name,
      item_image: img ? img : defaultImage,
      item_price: parseFloat(item_price).toFixed(2),
      item_description,
      subItem: parsedSubItem,
      store_id,
    };

    const createdItem = await Itemschema.create(bodyData);

    await Categoryschema.updateOne(
      { _id: category_id },
      {
        $push: { items: createdItem._id },
      }
    );

    return {
      responseCode: 201,
      success: true,
      resultCode: Json.item.success.add_item.resultCode,
      message: Json.item.success.add_item.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.item.error.add_item.resultCode,
      message: Json.item.error.add_item.message,
      db_error: error.message,
    };
  }
};

exports.getItems = async (req) => {
  const { id, dburi } = req;
  const { merchant_id, store_id, category_id } = req.body;
  const { page = 1, limit = 10 } = req.query;
  const setDefaultPage = Number(page);
  const setDefaultPageLimit = Number(limit);
  const Categoryschema = await dburi.model("categories", CategorySchema.schema);
  const Itemschema = await dburi.model("items", ItemSchema.schema);

  if (!category_id) {
    try {
      const availableCategoryItem = await Categoryschema.find({ store_id })
        .select("category_id category_name items")
        .populate({
          path: "items",
          select: "item_name item_image item_price",
          model: Itemschema,
        })
        .lean();

      const filteredData = availableCategoryItem.map((category) => ({
        _id: category._id,
        category_id: category.category_id,
        category_name: category.category_name,
        items: category.items.slice(0, 3),
      }));

      return {
        responseCode: 200,
        success: true,
        resultCode: Json.item.success.available_category_items.resultCode,
        message: Json.item.success.available_category_items.message,
        data: filteredData,
      };
    } catch (error) {
      return {
        responseCode: 500,
        success: false,
        resultCode: Json.item.error.get_items.resultCode,
        message: Json.item.error.get_items.message,
        db_error: error.message,
      };
    }
  } else {
    try {
      const totalDocuments = await Itemschema.countDocuments({
        category_id,
        store_id,
      });
      const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);

      const createdItem = await Itemschema.find({ category_id, store_id })
        .skip((setDefaultPage - 1) * setDefaultPageLimit)
        .limit(setDefaultPageLimit)
        .lean();

      const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
      const endRow = startRow + createdItem.length - 1;

      return {
        responseCode: 200,
        success: true,
        resultCode: Json.item.success.get_items.resultCode,
        message: Json.item.success.get_items.message,
        data: createdItem,
        totalPages,
        currentPage: setDefaultPage,
        limit: setDefaultPageLimit,
        totalCount: totalDocuments,
        showingRow: `${startRow} - ${endRow}`,
      };
    } catch (error) {
      return {
        responseCode: 500,
        success: false,
        resultCode: Json.item.error.get_items.resultCode,
        message: Json.item.error.get_items.message,
        db_error: error.message,
      };
    }
  }
};

exports.getItem = async (req) => {
  const { id, dburi } = req;
  const { item_id } = req.body;
  const Itemschema = await dburi.model("items", ItemSchema.schema);
  try {
    const Item = await Itemschema.findOne({ _id: item_id }).select(
      "-createdAt -updatedAt -__v"
    );

    let item = Item.toObject(); // Convert the Mongoose document to a plain JavaScript object

    // Check if subItem exists and is an array before mapping
    if (item.subItem.length > 0 && Array.isArray(item.subItem)) {
      item.subItem = item.subItem.map((sub, index) => ({
        ...sub,
        id: index + 1, // id will be 1 for the first object, 2 for the second object
      }));
    }

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.item.success.get_particular_item.resultCode,
      message: Json.item.success.get_particular_item.message,
      data: item,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.item.error.get_particular_item.resultCode,
      message: Json.item.error.get_particular_item.message,
      db_error: error.message,
    };
  }
};

exports.updateItem = async (req) => {
  const { id, dburi } = req;
  const { item_id, item_name, item_price, item_description, subItem } =
    req.body;
  const { item_image } = req.files || {};
  const Storeschema = await dburi.model("stores", StoreSchema.schema);
  const Categoryschema = await dburi.model("categories", CategorySchema.schema);
  const Itemschema = await dburi.model("items", ItemSchema.schema);

  const defaultImage =  Bucket.default_item_image

  try {
    const item = await Itemschema.findOne({ _id: item_id });
    const store = await Storeschema.findOne({ _id: item.store_id });

    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.token_error.resultCode,
        message: Json.item.error.token_error.message,
      };
    }

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.token_error.resultCode,
        message: Json.item.error.token_error.message1,
      };
    }

    const category = await Categoryschema.findOne({ _id: item.category_id });

    if (!category) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.add_item.resultCode,
        message: Json.item.error.add_item.message1,
      };
    }

    if (!item) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.update_item.resultCode,
        message: Json.item.error.update_item.message1,
      };
    }

    let uploadedLink = null;

    const imagePath = `${Bucket.path}${merchant.merchant_name}/stores/${store.store_name}/items/${category.category_name}_${item_name}.jpg`;

    const extractText = (url) => {
      const match = url.match(/\/([^\/]+)\.jpg$/);
      return match ? match[1] : null;
    };
    const deletePath = `${Bucket.path}${
      merchant.merchant_name
    }/stores/${store.store_name}/items/${extractText(item.item_image)}.jpg`;

    if (item_image) {
      if (item.item_image !== "" && item.item_image !== defaultImage) {
        await DeleteImage({ imagePath: deletePath });
      }
      const ItemImage = await UploadImage({
        file: item_image.data,
        imagePath: imagePath,
      });

      uploadedLink = ItemImage;
    }

    const parsedSubItem = JSON.parse(subItem);
    const bodyData = {
      item_name,
      item_image: uploadedLink ? uploadedLink : item.item_image,
      item_price: parseFloat(item_price).toFixed(2),
      item_description,
      subItem: parsedSubItem,
    };

    await Itemschema.updateOne({ _id: item_id }, bodyData);

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.item.success.update_item.resultCode,
      message: Json.item.success.update_item.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.item.error.update_item.resultCode,
      message: Json.item.error.update_item.message,
      db_error: error.message,
    };
  }
};

exports.deleteItem = async (req) => {
  const { id, dburi } = req;
  const { item_id } = req.body;
  const Storeschema = await dburi.model("stores", StoreSchema.schema);
  const Itemschema = await dburi.model("items", ItemSchema.schema);
  try {
    const defaultImage = Bucket.default_item_image
    const item = await Itemschema.findOne({ _id: item_id });
    const store = await Storeschema.findOne({ _id: item.store_id });

    const merchant = await MerchantSchema.findById(id);

    if (!merchant) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.token_error.resultCode,
        message: Json.item.error.token_error.message,
      };
    }

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.token_error.resultCode,
        message: Json.item.error.token_error.message1,
      };
    }

    if (!item) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.update_item.resultCode,
        message: Json.item.error.update_item.message1,
      };
    }

    const extractText = (url) => {
      const match = url.match(/\/([^\/]+)\.jpg$/);
      return match ? match[1] : null;
    };
    const deletePath = `${Bucket.path}${
      merchant.merchant_name
    }/stores/${store.store_name}/items/${extractText(item.item_image)}.jpg`;

    if (defaultImage !== item.item_image) {
      await DeleteImage({ imagePath: deletePath });
    }

    await Itemschema.deleteOne({ _id: item_id });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.item.success.delete_item.resultCode,
      message: Json.item.success.delete_item.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.item.error.delete_item.resultCode,
      message: Json.item.error.delete_item.message,
      db_error: error.message,
    };
  }
};

exports.statusChange = async (req) => {
  const { id, dburi } = req;
  const { item_id } = req.body;
  const Itemschema = dburi.model("items", ItemSchema.schema);
  try {
    const item = await Itemschema.findOne({ _id: item_id });

    if (!item) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.item.error.status_change.resultCode,
        message: Json.item.error.status_change.message1,
      };
    }

    await Itemschema.findByIdAndUpdate(item_id, {
      item_available: item.item_available ? false : true,
    });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.item.success.status_change.resultCode,
      message: Json.item.success.status_change.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.item.error.delete_item.resultCode,
      message: Json.item.error.delete_item.message,
      db_error: error.message,
    };
  }
};

exports.getAllItems = async (req) => {
  const { id, dburi } = req;
  const { store_id } = req.body;

  const Itemschema = await dburi.model("items", ItemSchema.schema);
  const Categoryschema = await dburi.model("categories", CategorySchema.schema);

  try {
    const createdItem = await Itemschema.find({
      store_id,
      merchant_id: id,
    })
      .select(
        "item_name item_image item_price item_description item_available subItem store_id category_id merchant_id"
      )
      .populate({
        path: "category_id",
        select: "category_name",
        model: Categoryschema,
      });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.item.success.get_items.resultCode,
      message: Json.item.success.get_items.message,
      data: createdItem,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.item.error.get_items.resultCode,
      message: Json.item.error.get_items.message,
      db_error: error.message,
    };
  }
};
