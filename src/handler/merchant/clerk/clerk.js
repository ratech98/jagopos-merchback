const { ClerkSchema } = require("../../../models/common");

const { Json } = require("../../../utils/translate/merchant");

const generatePIN = () => {
  const PIN = Math.floor(1000 + Math.random() * 9000);
  return PIN.toString();
};

exports.addClerk = async (req) => {
  const { id, dburi } = req;
  const { clerk_name, store_id, merchant_id } = req.body;
  const Clerkschema = await dburi.model("clerks", ClerkSchema.schema);

  try {
    const generate = generatePIN();

    let clerk_pin;
    let isUnique = false;

    while (!isUnique) {
      clerk_pin = generate;
      const find = await Clerkschema.findOne({ clerk_pin, store_id });
      if (!find) {
        isUnique = true;
      }
    }

    const bodyData = {
      clerk_name,
      clerk_pin: clerk_pin,
      store_id,
      merchant_id,
    };

    await Clerkschema.create(bodyData);

    return {
      responseCode: 201,
      success: true,
      resultCode: Json.clerk.success.add_clerk.resultCode,
      message: Json.clerk.success.add_clerk.message,
    };
  } catch (error) {
    let responseCode = 500;
    let resultCode = Json.clerk.error.add_clerk.resultCode;
    let message = Json.clerk.error.add_clerk.message;

    if (error.name === "ValidationError") {
      responseCode = 400;
      resultCode = Json.item.error.validation_error.resultCode;
      message = Json.item.error.validation_error.message;
    }

    return {
      responseCode,
      success: false,
      resultCode,
      message,
      db_error: error.message,
    };
  }
};

exports.getClerks = async (req) => {
  const { id, dburi } = req;
  const { store_id } = req.body;
  const { page = 1, limit = 10 } = req.query;
  const setDefaultPage = Number(page);
  const setDefaultPageLimit = Number(limit);
  const Clerkschema = await dburi.model("clerks", ClerkSchema.schema);

  try {
    const totalDocuments = await Clerkschema.countDocuments({ store_id });
    const totalPages = Math.ceil(totalDocuments / setDefaultPageLimit);
    const clerks = await Clerkschema.find({ store_id })
      .skip((setDefaultPage - 1) * setDefaultPageLimit)
      .limit(setDefaultPageLimit)
      .lean();

    const startRow = (setDefaultPage - 1) * setDefaultPageLimit + 1;
    const endRow = startRow + clerks.length - 1;

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.clerk.success.get_clerks.resultCode,
      message: Json.clerk.success.get_clerks.message,
      data: clerks,
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
      resultCode: Json.clerk.error.get_clerks.resultCode,
      message: Json.clerk.error.get_clerks.message,
      db_error: error.message,
    };
  }
};

exports.getClerk = async (req) => {
  const { id, dburi } = req;
  const { clerk_id } = req.body;
  const Clerkschema = await dburi.model("clerks", ClerkSchema.schema);

  try {
    const clerk = await Clerkschema.findOne({ _id: clerk_id }).select(
      "-createdAt -updatedAt -__v"
    );

    if (!clerk) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.clerk.error.get_clerk.resultCode,
        message: Json.clerk.error.get_clerk.message1,
      };
    }

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.clerk.success.get_clerk.resultCode,
      message: Json.clerk.success.get_clerk.message,
      data: clerk,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.clerk.error.get_clerk.resultCode,
      message: Json.clerk.error.get_clerk.message,
      db_error: error.message,
    };
  }
};

exports.updateClerk = async (req) => {
  const { id, dburi } = req;
  const { clerk_id, clerk_name } = req.body;
  const Clerkschema = await dburi.model("clerks", ClerkSchema.schema);

  try {
    const bodyData = {
      clerk_name,
    };

    const find = await Clerkschema.findOne({ _id: clerk_id });

    if (!find) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.clerk.error.update_clerk.resultCode,
        message: Json.clerk.error.update_clerk.message1,
      };
    }

    await Clerkschema.updateOne({ _id: clerk_id }, bodyData);

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.clerk.success.update_clerk.resultCode,
      message: Json.clerk.success.update_clerk.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.clerk.error.update_clerk.resultCode,
      message: Json.clerk.error.update_clerk.message,
      db_error: error.message,
    };
  }
};

exports.deleteClerk = async (req) => {
  const { id, dburi } = req;
  const { clerk_id } = req.body;
  const Clerkschema = await dburi.model("clerks", ClerkSchema.schema);

  try {
    const clerk = await Clerkschema.findOne({ _id: clerk_id });

    if (!clerk) {
      return {
        responseCode: 403,
        success: false,
        resultCode: Json.clerk.error.delete_clerk.resultCode,
        message: Json.clerk.error.delete_clerk.message1,
      };
    }

    await Clerkschema.deleteOne({ _id: clerk_id });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.clerk.success.delete_clerk.resultCode,
      message: Json.clerk.success.delete_clerk.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.clerk.error.delete_clerk.resultCode,
      message: Json.clerk.error.delete_clerk.message,
      db_error: error.message,
    };
  }
};

exports.statusChange = async (req) => {
  const { id, dburi } = req;
  const { clerk_id } = req.body;
  const Clerkschema = await dburi.model("clerks", ClerkSchema.schema);

  try {
    const find = await Clerkschema.findById(clerk_id);

    if (!find) {
      return {
        responseCode: 500,
        success: false,
        resultCode: Json.clerk.error.status_change.resultCode,
        message: Json.clerk.error.status_change.message,
        db_error: error.message,
      };
    }

    await Clerkschema.findByIdAndUpdate(clerk_id, {
      status: find.status ? false : true,
    });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.clerk.success.status_change.resultCode,
      message: Json.clerk.success.status_change.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.clerk.error.status_change.resultCode,
      message: Json.clerk.error.status_change.message,
      db_error: error.message,
    };
  }
};
