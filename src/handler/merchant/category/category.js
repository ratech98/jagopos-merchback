const {
  CategorySchema,  
  StoreSchema,
  ItemSchema,
} = require("../../../models/common");
const MerchantSchema = require("../../../models/merchant");


const { Json } = require("../../../utils/translate/merchant");
const { Bucket } = require("../../../utils/translate/bucket");


const { deleteItem } = require("../../merchant/item/item");

const { UploadImage, DeleteImage } = require("../../../utils/image-upload");

exports.addCategory = async (req) => {
  const { id, dburi} = req;
  const { store_id, category_name, merchant_id } = req.body;
  const { category_image } = req.files || {};
  const Storeschema =await dburi.model("stores", StoreSchema.schema);
  const Categoryschema =await dburi.model("categories", CategorySchema.schema);


  try {
    const merchant = await MerchantSchema.findById(id);

    if(!merchant){
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.category.error.token_error.resultCode,
        message: Json.category.error.token_error.message,
      };
    }

    const store = await Storeschema.findOne({ _id: store_id });

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.category.error.token_error.resultCode,
        message: Json.category.error.token_error.message1,
      };
    }

    const bodyData = {
      merchant_id,
      store_id,
      category_name,
    };
    const response = await Categoryschema.create(bodyData);

    if (category_image) {
      const imagePath = `${Bucket.path}${merchant.merchant_name}/stores/${store.store_name}/categories/${category_name}.jpg`;
      const Image = await UploadImage({
        file: category_image.data,
        imagePath: imagePath,
      });

      await Categoryschema.findByIdAndUpdate(response._id, {
        category_image: Image,
      });
    }

    return {
      responseCode: 201,
      success: true,
      resultCode: Json.category.success.add_category.resultCode,
      message: Json.category.success.add_category.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.category.error.add_category.resultCode,
      message: Json.category.error.add_category.message,
      db_error: error.message,
    };
  }
};

exports.getCategories = async (req) => {
  const { id, dburi } = req;
  const { store_id } = req.body;
  const { page = 1, limit = 10 } = req.query;
  const setDefaultPage = Number(page);
  const setDefaultPageLimit = Number(limit);
  const Categoryschema = dburi.model("categories", CategorySchema.schema);
  
  try {


    const totalDocuments = await Categoryschema.countDocuments({ store_id });
    const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);
    const categories = await Categoryschema.find({ store_id })
      .skip((setDefaultPage - 1) * setDefaultPageLimit)
      .limit(setDefaultPageLimit)
      .lean();

    const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
    const endRow = startRow + categories.length - 1;

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.category.success.get_categories.resultCode,
      message: Json.category.success.get_categories.message,
      data: categories,
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
      resultCode: Json.category.error.get_categories.resultCode,
      message: Json.category.error.get_categories.message,
      db_error: error.message,
    };
  }
};

exports.getCategory = async (req) => {
  const { id,dburi } = req;
  const { store_id, category_id } = req.body;
  const Categoryschema = dburi.model("categories", CategorySchema.schema);

  try {
    const category = await Categoryschema.findOne({
      store_id,
      _id: category_id,
    });

    if (!category) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.category.error.not_found.resultCode,
        message: Json.category.error.not_found.message,
      };
    }

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.category.success.get_particular_category.resultCode,
      message: Json.category.success.get_particular_category.message,
      data: category,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.category.error.get_particular_category.resultCode,
      message: Json.category.error.get_particular_category.message,
      db_error: error.message,
    };
  }
};

exports.updateCategory = async (req) => {
  const { id, dburi } = req;
  const { category_id, category_name } = req.body;
  const { category_image } = req.files || {};
  const Storeschema = dburi.model("stores", StoreSchema.schema);
  const Categoryschema = dburi.model("categories", CategorySchema.schema);

  try {
    const merchant = await MerchantSchema.findById(id);

    if(!merchant){
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.category.error.token_error.resultCode,
        message: Json.category.error.token_error.message,
      };
    }

    const find = await Categoryschema.findOne({ _id: category_id });

    if (!find) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.category.error.not_found.resultCode,
        message: Json.category.error.not_found.message,
      };
    }

    const store = await Storeschema.findOne({ _id: find.store_id });

    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.category.error.token_error.resultCode,
        message: Json.category.error.token_error.message1,
      };
    }

    let uploadedLink = null;

    const imagePath = `${Bucket.path}${merchant.merchant_name}/stores/${store.store_name}/category/${category_name}.jpg`;

    const extractText = (url) => {
      const match = url.match(/\/([^\/]+)\.jpg$/);
      return match ? match[1] : null;
    };
    const deletePath = `${Bucket.path}${
      merchant.merchant_name
    }/stores/${store.store_name}/category/${extractText(
      find.category_image
    )}.jpg`;

    if (category_image) {
      if (find.category_image !== "") {
        await DeleteImage({ imagePath: deletePath });
      }

      const StoreImage = await UploadImage({
        file: category_image.data,
        imagePath: imagePath,
      });

      uploadedLink = StoreImage;
    }

    await Categoryschema.updateOne(
      { _id: category_id },
      {
        $set: {
          category_image: uploadedLink ? uploadedLink : find.category_image,
          category_name,
        },
      }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.category.success.update_category.resultCode,
      message: Json.category.success.update_category.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.category.error.update_category.resultCode,
      message: Json.category.error.update_category.message,
      db_error: error.message,
    };
  }
};

exports.deleteCategory = async (req) => {
  const { id, dburi } = req;
  const { category_id } = req.body;
  const Storeschema = dburi.model("stores", StoreSchema.schema);
  const Categoryschema = dburi.model("categories", CategorySchema.schema);
  const Itemschema = dburi.model("items", ItemSchema.schema);

  

  try {

    const merchant = await MerchantSchema.findById(id);

    if(!merchant){
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.category.error.token_error.resultCode,
        message: Json.category.error.token_error.message,
      };
    }
    
    const category = await Categoryschema.findOne({ _id: category_id });

    

    if (!category) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.category.error.delete_category.resultCode,
        message: Json.category.error.delete_category.message,
      };
    }

    const store = await Storeschema.findOne({ _id: category.store_id });



    if (!store) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.category.error.token_error.resultCode,
        message: Json.category.error.token_error.message1,
      };
    }

    if (category) {
      const items = await Itemschema.find({
        category_id: category._id,
      });



      if (items.length > 0) {
        await Promise.all(
          items.map((item) => {
            const itemObject = {
              id: id,
              dburi: dburi,
              body: { item_id: item._id },
            };
            return deleteItem(itemObject);
          })
        );
      }


      const extractText = (url) => {
        const match = url.match(/\/([^\/]+)\.jpg$/);
        return match ? match[1] : null;
      };
      const deletePath = `${Bucket.path}${
        merchant.merchant_name
      }/stores/${store.store_name}/category/${extractText(
        category.category_image
      )}.jpg`;

      await DeleteImage({ imagePath: deletePath });

      await Categoryschema.deleteOne({ _id: category_id });
      return {
        responseCode: 200,
        success: true,
        resultCode: Json.category.success.delete_category.resultCode,
        message: Json.category.success.delete_category.message,
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.category.error.delete_category.resultCode,
      message: Json.category.error.delete_category.message,
      db_error: error.message,
    };
  }
};

exports.updateCategoryStatus = async (req) => {
  const { id, dburi } = req;
  const { category_id } = req.body;
  const Categoryschema = dburi.model("categories", CategorySchema.schema);

  try {
    const getCategory = await Categoryschema.findById(category_id);

    if (!getCategory) {
      return {
        responseCode: 500,
        success: true,
        resultCode: Json.category.error.update_category.resultCode,
        message: Json.category.error.update_category.message1,
      };
    }

    await Categoryschema.updateOne(
      { _id: category_id },
      { category_status: getCategory.category_status ? false : true }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.category.success.update_category.resultCode,
      message: Json.category.success.update_category.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.category.error.update_category.resultCode,
      message: Json.category.error.update_category.message,
      db_error: error.message,
    };
  }
};

exports.getAllCategories = async (req) => {
  const { id, dburi} = req;
  const { store_id } = req.body;
  const Categoryschema = dburi.model("categories", CategorySchema.schema);

  try {
    const categories = await Categoryschema.find({ store_id }).select(
      "category_name"
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.category.success.get_categories.resultCode,
      message: Json.category.success.get_categories.message,
      data: categories,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.category.error.get_categories.resultCode,
      message: Json.category.error.get_categories.message,
      db_error: error.message,
    };
  }
};
