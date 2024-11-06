const {
    StoreSchema,
   
  } = require("../../../models/common");
  
  const MerchantSchema = require("../../../models/merchant");
  
  const { AdminconnectTenantDB } = require("../../../config");

  const { Json } = require("../../../utils/translate/merchant");


exports.getStores = async (req) => {
    const { merchant_name } = req.body;
    const { page = 1, limit = 10 } = req.query;
    const setDefaultPage = Number(page);
    const setDefaultPageLimit = Number(limit);
  
  
    // const getDomainLink = await AdminSchema.find();
  
    try {
        console.log(merchant_name)
        const merchantname = merchant_name;
        const formattedName = merchantname.replace(/-/g, " ");
    
     console.log("formattedname",formattedName)
        const Merchant = await MerchantSchema.findOne({
          merchant_name: formattedName,
        });
    // console.log("merchant",Merchant)
        if (!Merchant) {
          return {
            responseCode: 400,
            success: false,
            resultCode: Json.create_order.error.merchant.resultCode,
            message: Json.create_order.error.merchant.message,
          };
        }
    
        const { dburi } = await AdminconnectTenantDB(Merchant._id);
    // console.log("dburi",dburi)
        const Storeschema = await dburi.model("stores", StoreSchema.schema);


      const totalDocuments = await Storeschema.countDocuments({
        merchant_id: Merchant._id,
      });
      console.log(totalDocuments)
      const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);
      const stores = await Storeschema.find({ merchant_id: Merchant._id })
        .skip((setDefaultPage - 1) * setDefaultPageLimit)
        .limit(setDefaultPageLimit)
        .lean();
  console.log(stores)
      const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
      const endRow = startRow + stores.length - 1;
//   console.log("function ended")
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
        showingRow: `${startRow} - ${endRow}`
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