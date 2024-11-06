const { StoreSchema } = require("../../../models/common");

const { Json } = require("../../../utils/translate/kds");

exports.getStores = async (req) => {
  const { id, dburi } = req;
  try {
    const Storeschema = await dburi.model("stores", StoreSchema.schema);

    const stores = await Storeschema.find({ merchant_id: id }).select(
      "-__v -updatedAt -createdAt"
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.store.success.get_store.resultCode,
      message: Json.store.success.get_store.message,
      data: stores,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.store.error.get_store.resultCode,
      message: Json.store.error.get_store.message,
      db_error: error.message,
    };
  }
};
