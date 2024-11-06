const MerchantSchema = require("../../../models/merchant");
const { Json } = require("../../../utils/translate/merchant");
const { Bucket } = require("../../../utils/translate/bucket");


const { UploadImage, DeleteImage } = require("../../../utils/image-upload");
const { createDatabase } = require("../../../config");
const {generateUrl} = require("../../../utils/db-url-generate/db-url-generate")

exports.addMerchant = async (req) => {
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


  const generatedURL = generateUrl(`db-001-${merchant_phone_number}`)


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
    db_uri: generatedURL
  };

  try {
    const merchant = await MerchantSchema.create(bodyData);
    await createDatabase({
      name: `db-001-${merchant.merchant_phone_number}`,
      dburi: merchant.db_uri,
    });

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

exports.getMerchant = async (req) => {
  const { id } = req;
  try {
    const merchant = await MerchantSchema.findOne({ _id: id }).select(
      "-createdAt -updatedAt -__v"
    );

    if (!merchant) {
      return {
        responseCode: 403,
        resultCode: Json.merchant.error.get_merchant.resultCode,
        success: false,
        message: Json.merchant.error.get_merchant.message2,
      };
    }

    return {
      responseCode: 200,
      resultCode: Json.merchant.success.get_merchant.resultCode,
      success: true,
      message: Json.merchant.success.get_merchant.message,
      data: merchant,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.merchant.error.get_merchant.resultCode,
      message: Json.merchant.error.get_merchant.message2,
      db_error: error.message,
    };
  }
};

exports.updateMerchant = async (req) => {
  const { id } = req;
  const {
    contact_name,
    contact_phone_number,
    contact_street,
    contact_city,
    contact_state,
    contact_zip_code,
  } = req.body;

  const { full_logo, small_logo } = req.files || {};
  const defaultLargeImage = Bucket.default_merchant_full_logo;

  const defaultSmallImage = Bucket.default_merchant_small_logo;

  try {
    const merchant = await MerchantSchema.findOne({ _id: id }).select(
      "-createdAt -updatedAt -__v"
    );
    if (merchant) {
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

      await MerchantSchema.findOneAndUpdate(
        {
          _id: id,
        },
        {
          contact_name,
          contact_phone_number,
          contact_street,
          contact_city,
          contact_state,
          contact_zip_code,
          bussiness_logo: {
            full_logo: FullLogo ? FullLogo : merchant.bussiness_logo.full_logo,
            small_logo: SmallLogo
              ? SmallLogo
              : merchant.bussiness_logo.small_logo,
          },
        }
      );
      return {
        responseCode: 200,
        resultCode: Json.merchant.success.update_merchant.resultCode,
        success: true,
        message: Json.merchant.success.update_merchant.message,
      };
    } else {
      return {
        responseCode: 403,
        resultCode: Json.merchant.error.update_merchant.resultCode,
        success: false,
        message: Json.merchant.error.update_merchant.message,
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      resultCode: Json.merchant.error.update_merchant.resultCode,
      success: false,
      message: Json.merchant.error.update_merchant.message,
      db_error: error.message,
    };
  }
};
