const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { MerchantSchema, DeviceSchema } = require("../models/common");
const jwt = require("jsonwebtoken");
const { generateUrl } = require("../utils/db-url-generate/db-url-generate");
const { Json } = require("../utils/translate/admin");

const url = process.env._DB_URL;
const tenantConnections = {};
const tokenConnections = {};

const connectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log("Connecting to primary MongoDB...");
    await mongoose.connect(url, {
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log("Connected to primary MongoDB successfully");
  } else {
    console.log("Using existing MongoDB connection");
  }

  try {
    const merchants = await MerchantSchema.find({});
    await Promise.all(
      merchants.map(async (merchant) => {
        if (merchant.db_uri && !tenantConnections[merchant._id]) {
          tenantConnections[merchant._id] = await mongoose.createConnection(
            merchant.db_uri,
            {
              socketTimeoutMS: 30000,
              connectTimeoutMS: 30000,
            }
          );
          console.log(`Connected to tenant DB: ${merchant.merchant_name}`);
        }
      })
    );
  } catch (err) {
    console.error("Error connecting to tenant databases:", err);
  }

  try {
    const dbName = "db-token";
    const token = "db_token";
    const generatedURL = await generateUrl(dbName);
    tokenConnections[token] = await mongoose.createConnection(generatedURL, {
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
  } catch (error) {
    console.error("Error creating token connection:", error);
  }
};

const connectTenantDB = async (req, res, next) => {
  try {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = tokenHeader.split(" ")[1];
    const data = jwt.verify(token, process.env._JWT_SECRET_KEY);
    const tenant = await MerchantSchema.findById(data.id);

    if (!tenant) {
      return res.status(Json.token_error.responseCode).json({
        resultCode: Json.token_error.resultCode,
        message: Json.token_error.message,
      });
    }

    let tenantDBConnection = tenantConnections[tenant._id];
    if (!tenantDBConnection && tenant.db_uri) {
      tenantDBConnection = await mongoose.createConnection(tenant.db_uri, {
        socketTimeoutMS: 30000,
        connectTimeoutMS: 30000,
      });
      tenantConnections[tenant._id] = tenantDBConnection;
    }

    if (data.mac_address) {
      const deviceModel = tenantDBConnection.model("devices", DeviceSchema.schema);
      const checkMac = await deviceModel.find({ mac_address: data.mac_address, type: data.type });

      if (checkMac.length === 0) {
        return res.status(400).json({
          success: false,
          resultCode: Json.token_error.resultCode,
          message: Json.token_error.message1,
          code: "-1",
        });
      }
    }

    req.id = data.id;
    req.dburi = tenantDBConnection;
    next();
  } catch (error) {
    console.error("Error connecting tenant DB:", error.message);
    res.status(Json.token_error.responseCode).json({
      success: false,
      resultCode: Json.token_error.resultCode,
      message: Json.token_error.message,
    });
  }
};

const AdminconnectTenantDB = async (req) => {
  try {
    const tenant = await MerchantSchema.findById(req);
    if (!tenant) {
      return {
        responseCode: Json.token_error.responseCode,
        success: false,
        resultCode: Json.token_error.resultCode,
        message: Json.token_error.message1,
      };
    }

    let tenantDBConnection = tenantConnections[tenant._id];
    if (!tenantDBConnection && tenant.db_uri) {
      tenantDBConnection = await mongoose.createConnection(tenant.db_uri, {
        socketTimeoutMS: 30000,
        connectTimeoutMS: 30000,
      });
      tenantConnections[tenant._id] = tenantDBConnection;
    }

    return { dburi: tenantDBConnection };
  } catch (error) {
    return {
      responseCode: Json.token_error.responseCode,
      success: false,
      resultCode: Json.token_error.resultCode,
      message: Json.token_error.message,
    };
  }
};

const ConnectDBToken = async (name) => {
  try {
    const generatedURL = await generateUrl(name);
    const token = "db_token";
    let tenantDBConnection = tokenConnections[token];

    if (!tenantDBConnection && generatedURL) {
      tenantDBConnection = await mongoose.createConnection(generatedURL, {
        socketTimeoutMS: 30000,
        connectTimeoutMS: 30000,
      });
      tokenConnections[token] = tenantDBConnection;
    }

    return { dbtokenuri: tenantDBConnection };
  } catch (error) {
    return {
      responseCode: Json.token_error.responseCode,
      success: false,
      resultCode: Json.token_error.resultCode,
      message: Json.token_error.message,
    };
  }
};

const createDatabase = async ({ name, dburi }) => {
  const tenantClient = new MongoClient(dburi);
  await tenantClient.connect();
  const db = tenantClient.db(name);
  const collections = ["categories", "clerks", "orders", "items", "stores", "devices"];
  await Promise.all(collections.map((collection) => db.createCollection(collection)));
  await tenantClient.close();
};

const createDatabaseToken = async ({ name, dburi }) => {
  const tenantClient = new MongoClient(dburi);
  await tenantClient.connect();
  await tenantClient.db(name).createCollection("tokens");
  await tenantClient.close();
};

const renameDatabase = async ({ oldDbName, newDbName, url }) => {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const oldDb = client.db(oldDbName);
    const newDb = client.db(newDbName);
    const collections = await oldDb.listCollections().toArray();

    await Promise.all(
      collections.map(async ({ name }) => {
        const oldCollection = oldDb.collection(name);
        const newCollection = newDb.collection(name);
        const documents = await oldCollection.find().toArray();
        if (documents.length > 0) await newCollection.insertMany(documents);
      })
    );

    await oldDb.dropDatabase();
    console.log(`Database renamed from '${oldDbName}' to '${newDbName}'`);
    return { success: true };
  } catch (error) {
    console.error("Error renaming database:", error.message);
  } finally {
    await client.close();
  }
};

module.exports = {
  connectDB,
  connectTenantDB,
  createDatabase,
  AdminconnectTenantDB,
  createDatabaseToken,
  ConnectDBToken,
  renameDatabase,
};
