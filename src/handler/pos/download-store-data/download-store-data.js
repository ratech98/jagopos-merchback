const { AdminconnectTenantDB } = require("../../../config");
const {
  StoreSchema,
  ItemSchema,
  CategorySchema,
} = require("../../../models/common");

const { Json } = require("../../../utils/translate/pos");

exports.getStoreData = async (req) => {
  const { user, dburi } = req;

  const { store_id } = req.body;

  if (user === "clerk") {
    return {
      responseCode: 401,
      success: false,
      resultCode: Json.item.error.token_error.resultCode,
      message: Json.item.error.token_error.message3,
    };
  }

  try {
    const Storeschema = dburi.model("stores", StoreSchema.schema);
    const Categoryschema = dburi.model("categories", CategorySchema.schema);
    const Itemsschema = dburi.model("items", ItemSchema.schema);

    const GetStore = await Storeschema.findOne({ _id: store_id });

    if (!GetStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.item.error.token_error.resultCode,
        message: Json.item.error.token_error.message1,
      };
    }

    const GetCategory = await Categoryschema.find({
      store_id: store_id,
      category_status: true,
    });

    // if (GetCategory.length === 0) {
    //   return {
    //     responseCode: 404,
    //     success: false,
    //     resultCode: Json.item.error.token_error.resultCode,
    //     message: Json.item.error.token_error.message2,
    //   };
    // }

    const GetItems = await Itemsschema.find({
      store_id: store_id,
      item_available: true,
    });

    // Prepare category map
    let categoryMap = GetCategory.reduce((acc, item) => {
      acc[item._id] = {
        // store_id: item.store_id,
        category_id: item._id,
        category: item.category_name,
        items_data: [],
      };
      return acc;
    }, {});

    // Associate items with their categories
    GetItems.forEach((item) => {
      if (categoryMap[item.category_id]) {
        categoryMap[item.category_id].items_data.push({
          item_id: item._id,
          name: item.item_name,
          description: item.item_description,
          price: item.item_price,
          image: item.item_image,
          status: item.item_available,
          sub_item:
            item.subItem.length > 0
              ? item.subItem.map((sub) => ({
                  _id: sub?._id,
                  id: sub?.id,
                  name: sub?.name,
                  extra: false,
                  no: false,
                }))
              : item.subItem,
          notes: null,
        });
      }
    });

    const categoryList = GetCategory.map((item) => ({
      name: item.category_name,
      id: item._id,
    }));

    // Convert categoryMap to array
    const storeCategory = Object.values(categoryMap);

    const updateData = {
      all_categories: categoryList,
      all_items: storeCategory,
      store_details: {
        id: GetStore._id,
        name: GetStore.store_name,
      },
    };

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.item.success.get_all_items.resultCode,
      message: Json.item.success.get_all_items.message,
      data: updateData,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.item.error.token_error.resultCode,
      message: Json.item.error.token_error.message,
      db_error: error.message,
    };
  }
};
