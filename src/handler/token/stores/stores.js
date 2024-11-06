const { StoreSchema } = require("../../../models/common");
const { Json } = require("../../../utils/translate/token");

exports.stores = async (req) => {
  const { dburi, id } = req;

  try {
    const Storeschema = await dburi.model("stores", StoreSchema.schema);
    const stores = await Storeschema.find({ merchant_id: id });

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.store.success.get_all_stores.resultCode,
      message: Json.store.success.get_all_stores.message,
      data: stores,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.store.error.get_all_stores.resultCode,
      message: Json.store.error.get_all_stores.message,
      db_error: error.message,
    };
  }
};

exports.updateStoreTime = async (req) => {
  const { dburi } = req;
  const { store_id, open_time, close_time } = req.body;

  try {
    const Storeschema = await dburi.model("stores", StoreSchema.schema);
    const stores = await Storeschema.findById(store_id);

    if (!stores) {
      return {
        success: false,
        responseCode: 500,
        resultCode: Json.set_close_time.error.resultCode,
        message: Json.set_close_time.error.message,
        db_error: error.message,
      };
    }

    const updatedDetails = await Storeschema.findByIdAndUpdate(
      store_id,
      {
        store_open_time: open_time,
        store_close_time: close_time
      },
      { new: true }
    );

    return {
      success: true,
      responseCode: 200,
      resultCode: Json.set_close_time.success.resultCode,
      message: Json.set_close_time.success.message,
      data: updatedDetails,
    };
  } catch (error) {
    return {
      success: false,
      responseCode: 500,
      resultCode: Json.set_close_time.error.resultCode,
      message: Json.set_close_time.error.message,
      db_error: error.message,
    };
  }
};


