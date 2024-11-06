const AdminSchema = require("../../../models/admin");

const { Json } = require("../../../utils/translate/admin");

exports.addurl = async function (req, res) {
  const { id } = req;
  const { domain } = req.body;

  try {
    const Admin = await AdminSchema.findOne({ admin_id: id });

    if (!Admin) {
      return {
        success: true,
        responseCode: Json.token_error.responseCode,
        resultCode: Json.token_error.resultCode,
        message: Json.token_error.message,
      };
    }

    await AdminSchema.findOneAndUpdate(
      { admin_id: id },
      {
        web_order_domain: domain,
      }
    );

    return {
      success: true,
      responseCode: 201,
      resultCode: Json.add_domain.success.resultCode,
      message: Json.add_domain.success.message,
    };
  } catch (error) {
    return {
      success: true,
      responseCode: 500,
      resultCode: Json.add_domain.error.resultCode,
      message: Json.add_domain.error.message,
      db_error: error.message,
    };
  }
};

exports.geturl = async function (req, res) {
  const { id } = req;

  try {
    const Admin = await AdminSchema.findOne({ admin_id: id });

    if (!Admin) {
      return {
        success: true,
        responseCode: Json.token_error.responseCode,
        resultCode: Json.token_error.resultCode,
        message: Json.token_error.message,
      };
    }

    return {
      success: true,
      responseCode: 201,
      resultCode: Json.get_domain.success.resultCode,
      message: Json.get_domain.success.message,
      data: Admin,
    };
  } catch (error) {
    return {
      success: true,
      responseCode: 500,
      resultCode: Json.get_domain.error.resultCode,
      message: Json.get_domain.error.message,
      db_error: error.message,
    };
  }
};
