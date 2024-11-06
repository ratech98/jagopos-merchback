const dayjs = require("dayjs");
const {
  CreateOrderSchema,
  StoreSchema,
  AdminSchema,
} = require("../../../models/common");

const { Json } = require("../../../utils/translate/kds");
const { ObjectId } = require("mongodb");

exports.OrderOpened = async (req) => {
  const { dburi } = req;
  const { search } = req.query;
  const { store_id } = req.body;

  try {
    // Initialize schemas once
    const Storeschema = dburi.model("stores", StoreSchema.schema);
    const CreateOrderschema = dburi.model("orders", CreateOrderSchema.schema);

    // Check if store exists
    const checkStore = await Storeschema.findById(store_id);
    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.get_opened.resultCode,
        message: Json.orders.error.get_opened.message1,
      };
    }


    // Search for orders
    const orders = await CreateOrderschema.find({
      store_id: store_id,
      order_status: { $in: ["Accepted", "Cooking"] },
      $or: [
        { order_id: { $regex: new RegExp(search, "i") } },
        { customer_name: { $regex: new RegExp(search, "i") } },
        { phone: { $regex: new RegExp(search, "i") } },
        { order_type: { $regex: new RegExp(search, "i") } },
        { "order_data.name": { $regex: new RegExp(search, "i") } },
      ],
    }).select("-__v -updatedAt -createdAt");

    // Sort orders by position
    const sortedData = orders.sort((a, b) => a.position - b.position);

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.success.get_opened.resultCode,
      message: Json.orders.success.get_opened.message,
      data: sortedData,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.orders.error.get_opened.resultCode,
      message: Json.orders.error.get_opened.message,
      db_error: error.message,
    };
  }
};

exports.OrderClosed = async (req) => {
  const { dburi } = req;
  const { search } = req.query;

  const { store_id, merchant_id } = req.body;
  try {
    const Storeschema = await dburi.model("stores", StoreSchema.schema);
    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );

    const checkStore = await Storeschema.findById(store_id);

    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.get_closed.resultCode,
        message: Json.orders.error.get_closed.message1,
      };
    }

    const todayDate = dayjs().format("YYYY-MM-DD");

    // const yesterdayDate = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const orders = await CreateOrderschema.find({
      store_id: store_id,
      order_status: { $in: ["Ready", "Cancelled"] },
      order_date: { $in: [todayDate] },
      $or: [
        // Match any of the following conditions
        { order_id: { $regex: new RegExp(search, "i") } },
        { cusomer_name: { $regex: new RegExp(search, "i") } },
        { phone: { $regex: new RegExp(search, "i") } },
        { order_type: { $regex: new RegExp(search, "i") } },
        { "order_data.name": { $regex: new RegExp(search, "i") } },
      ],
    })
      .select("-__v -updatedAt -createdAt")
      .sort({ updatedAt: "desc" });

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.success.get_closed.resultCode,
      message: Json.orders.success.get_closed.message,
      data: orders,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.orders.error.get_closed.resultCode,
      message: Json.orders.error.get_closed.message,
      db_error: error.message,
    };
  }
};

exports.updateOrder = async (req) => {
  const { dburi } = req;
  const { order_id, date, type, sub_item_id, item_id, store_id, closed_time } =
    req.body;

  const CreateOrderschema = await dburi.model(
    "orders",
    CreateOrderSchema.schema
  );

  try {
    const find = await CreateOrderschema.findOne({
      order_id: order_id,
      order_date: date,
      store_id,
    });

    if (!find) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.update_order.resultCode,
        message: Json.orders.error.update_order.message1,
      };
    }

    if (type === "submit") {
      const updateData = find.order_data.map((item) => {
        item.item_strike = true;

        if (item.notes) {
          item.notes.forEach((note) => {
            note.strike = true;
          });
        }

        if (item.sub_item) {
          item.sub_item.forEach((subItem) => {
            subItem.strike = true;
          });
        }

        return item;
      });

      await CreateOrderschema.findOneAndUpdate(
        { order_id: order_id, order_date: date, store_id },
        {
          order_data: updateData,
          recall: false,
        }
      );

      return {
        responseCode: 200,
        success: true,
        resultCode: Json.orders.success.update_order.resultCode,
        message: Json.orders.success.update_order.message,
      };
    } else {
      const data = find;

      const itemToUpdate = data.order_data.find((item) =>
        item._id.equals(new ObjectId(`${item_id}`))
      );

      if (!itemToUpdate) {
        return {
          responseCode: 404,
          success: false,
          resultCode: Json.orders.error.update_order.resultCode,
          message: Json.orders.error.update_order.message2,
        };
      }

      if (type === "all") {
        itemToUpdate.item_strike = !itemToUpdate.item_strike;
        itemToUpdate?.notes?.forEach((note) => {
          note.strike = itemToUpdate.item_strike;
        });

        itemToUpdate?.sub_item?.forEach((subItem) => {
          subItem.strike = itemToUpdate.item_strike;
        });
      }

      if (type === "notes") {
        itemToUpdate?.notes?.forEach((note) => {
          note.strike = !note.strike;
        });
      }
      // Update the item based on the type

      if (type === "sub_item" && itemToUpdate.sub_item.length > 0) {
        const subItem = itemToUpdate.sub_item.find(
          (subItem) =>
            subItem.id === sub_item_id ||
            subItem._id.equals(new ObjectId(`${sub_item_id}`))
        );

        // If the sub-item is found, toggle the strike property
        if (subItem) {
          subItem.strike = !subItem.strike;
        }
      }

      // Update item_strike based on the status of notes and sub_items
      // const allNotesStruck = itemToUpdate.notes?.every((note) => note.strike);
      // const allSubItemsStruck = itemToUpdate.sub_item?.every(
      //   (subItem) => subItem.strike
      // );

      // itemToUpdate.item_strike = allNotesStruck && allSubItemsStruck;

      const getUpdatedData = await CreateOrderschema.findOneAndUpdate(
        { order_id: order_id, order_date: date, store_id },
        {
          order_data: data.order_data,
        },
        { new: true }
      );

      const checkOrderStatus = (order) => {
        for (let orderItem of order.order_data) {
          // Check if any item is not struck
          if (!orderItem.item_strike) {
            return {
              status: "Cooking",
              closed_time: "00:00:00",
              index: getUpdatedData.position,
            };
          }

          // Check if notes exist and if any note is not struck
          if (orderItem.notes && orderItem.notes.length > 0) {
            for (let note of orderItem.notes) {
              if (!note.strike) {
                return {
                  status: "Cooking",
                  closed_time: "00:00:00",
                  index: getUpdatedData.position,
                };
              }
            }
          }

          // Check if sub_items exist and if any sub_item is not struck
          if (orderItem.sub_item && orderItem.sub_item.length > 0) {
            for (let subItem of orderItem.sub_item) {
              if (!subItem.strike) {
                return {
                  status: "Cooking",
                  closed_time: "00:00:00",
                  index: getUpdatedData.position,
                };
              }
            }
          }
        }

        return {
          status: "Ready",
          closed_time: closed_time ? closed_time : "00:00:00",
          index: null,
        };
      };

      const orderStatus = checkOrderStatus(getUpdatedData);

      await CreateOrderschema.findOneAndUpdate(
        { order_id: order_id, order_date: date, store_id },
        {
          order_status: orderStatus.status,
          closed_time: orderStatus.closed_time,
          position: orderStatus.index,
        }
      );

      if (orderStatus.status === "Ready") {
        const orders = await CreateOrderschema.find({
          store_id: store_id,
          order_status: { $in: ["Accepted", "Cooking"] },
          order_date: date,
        }).sort({ position: "asc" });

        orders.map(
          async (item, index) =>
            await CreateOrderschema.findByIdAndUpdate(item._id, {
              position: index,
            })
        );
      }

      return {
        responseCode: 200,
        success: true,
        resultCode: Json.orders.success.update_order.resultCode,
        message: Json.orders.success.update_order.message,
      };
    }
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.orders.error.update_order.resultCode,
      message: Json.orders.error.update_order.message,
      db_error: error.message,
    };
  }
};

exports.closeOrder = async (req) => {
  const { dburi } = req;
  const { store_id } = req.body;

  try {
    const CreateOrderschema = await dburi.model(
      "orders",
      CreateOrderSchema.schema
    );
    const Storeschema = await dburi.model("stores", StoreSchema.schema);

    const checkStore = await Storeschema.findById(store_id);

    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.close_orders.resultCode,
        message: Json.orders.error.close_orders.message1,
      };
    }

    // const date = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const orders = await CreateOrderschema.find({
      store_id: store_id,
      order_status: {
        $in: ["Accepted", "Cooking", "Pending", "Paid", "Ready"],
      },
      // order_date: date,
    });

    if (orders.length > 0) {
      await orders.map(async (ord) => {
        if (ord.order_status === "Ready") {
          await CreateOrderschema.findByIdAndUpdate(ord._id, {
            order_status: "Completed",
          });
        } else {
          await CreateOrderschema.findByIdAndUpdate(ord._id, {
            order_status: "Cancelled",
          });
        }
      });
    }

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.success.close_orders.resultCode,
      message: Json.orders.success.close_orders.message,
    };
  } catch (error) {
    return {
      responseCode: 500,
      success: false,
      resultCode: Json.orders.error.close_orders.resultCode,
      message: Json.orders.error.close_orders.message,
      db_error: error.message,
    };
  }
};

exports.recall = async (req) => {
  const { dburi } = req;
  const { order_id, date, store_id } = req.body;

  const CreateOrderschema = await dburi.model(
    "orders",
    CreateOrderSchema.schema
  );
  const Storeschema = await dburi.model("stores", StoreSchema.schema);

  try {
    const checkStore = await Storeschema.findById(store_id);

    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.recall.resultCode,
        message: Json.orders.error.recall.message2,
      };
    }

    const find = await CreateOrderschema.findOne({
      order_id: order_id,
      order_date: date,
      store_id,
    });

    const findIndex = await CreateOrderschema.find({
      order_date: date,
      store_id,
      order_status: { $in: ["Accepted", "Cooking"] },
    });

    if (!find) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.recall.resultCode,
        message: Json.orders.error.recall.message,
      };
    }

    const updateData = find.order_data.map((item) => {
      item.item_strike = false;

      if (item.notes) {
        item.notes.forEach((note) => {
          note.strike = false;
        });
      }

      if (item.sub_item) {
        item.sub_item.forEach((subItem) => {
          subItem.strike = false;
        });
      }

      return item;
    });

    await CreateOrderschema.findOneAndUpdate(
      { order_id: order_id, order_date: date, store_id },
      {
        order_data: updateData,
        recall: true,
        order_status: "Accepted",
        position: findIndex.length,
      }
    );

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.success.recall.resultCode,
      message: Json.orders.success.recall.message,
    };
  } catch (error) {
    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.error.recall.resultCode,
      message: Json.orders.error.recall.message,
      db_error: error.message,
    };
  }
};

exports.front = async (req) => {
  const { dburi } = req;
  const { order_id, date, store_id } = req.body;

  const CreateOrderschema = await dburi.model(
    "orders",
    CreateOrderSchema.schema
  );
  const Storeschema = await dburi.model("stores", StoreSchema.schema);

  try {
    const checkStore = await Storeschema.findById(store_id);

    if (!checkStore) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.bump.resultCode,
        message: Json.orders.error.bump.message2,
      };
    }

    const findFront = await CreateOrderschema.find({
      order_date: date,
      store_id,
      order_status: { $in: ["Accepted", "Cooking"] },
    });

    const sortedData = findFront.sort((a, b) => {
      return a.position - b.position;
    });

    const find = await CreateOrderschema.findOne({
      order_id: order_id,
      order_date: date,
      store_id,
    });

    if (!find) {
      return {
        responseCode: 404,
        success: false,
        resultCode: Json.orders.error.bump.resultCode,
        message: Json.orders.error.bump.message,
      };
    }

    if (find.position === 0) {
      return {
        responseCode: 200,
        success: true,
        resultCode: Json.orders.success.bump.resultCode,
        message: Json.orders.success.bump.message,
      };
    }

    const filter = sortedData.filter((fil) => fil.position !== null);

    if (find.position && filter.length > 0) {
      function rearrangeIndex(data, id) {
        const targetIndex = data.findIndex((item) => item.order_id === id);

        if (targetIndex === -1) {
          return data;
        }

        const [targetObject] = data.splice(targetIndex, 1);
        targetObject.position = 0;
        data.unshift(targetObject);
        data.forEach((item, i) => {
          if (i > 0) {
            item.position = i;
          }
        });

        return data;
      }

      const result = rearrangeIndex(filter, order_id);

      if (result.length > 0) {
        result.map(async (item) => {
          await CreateOrderschema.findByIdAndUpdate(item._id, {
            position: item.position,
          });
        });
      }
    } else {
      await CreateOrderschema.findOneAndUpdate(
        { order_id: order_id, order_date: date, store_id },
        {
          position: filter.length === 0 ? 0 : filter.length,
        }
      );

      const findfront = await CreateOrderschema.find({
        order_date: date,
        store_id,
      });

      const filters = findfront.filter((fil) => fil.index !== null);

      function rearrangeIndex(data, id) {
        const targetIndex = data.findIndex((item) => item.order_id === id);

        if (targetIndex === -1) {
          return data;
        }

        const [targetObject] = data.splice(targetIndex, 1);
        targetObject.index = 0;
        data.unshift(targetObject);
        data.forEach((item, i) => {
          if (i > 0) {
            item.index = i;
          }
        });

        return data;
      }

      const result = rearrangeIndex(filters, order_id);

      if (result.length > 0) {
        result.map(async (item) => {
          await CreateOrderschema.findByIdAndUpdate(item._id, {
            index: item.index,
          });
        });
      }
    }

    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.success.bump.resultCode,
      message: Json.orders.success.bump.message,
    };
  } catch (error) {
    return {
      responseCode: 200,
      success: true,
      resultCode: Json.orders.error.bump.resultCode,
      message: Json.orders.error.bump.message,
      db_error: error.message,
    };
  }
};
