const { StoreSchema } = require("../../../models/common");

const MerchantSchema = require("../../../models/merchant");

const { Json } = require("../../../utils/translate/pos");

exports.getStores = async (req) => {
  const { id, dburi } = req;


  const Storeschema = dburi.model(
    "stores",
    StoreSchema.schema
  );

  try {
    const check = await MerchantSchema.findById(id);

    if (!check) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.store.error.token_error.resultCode,
        message: Json.store.error.token_error.message,
      };
    }

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
