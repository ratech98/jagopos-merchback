const { Storage } = require("@google-cloud/storage");
const {Bucket} = require("../translate/bucket")

const bucketName = process.env._BUCKET_NAME;

const storage = new Storage({
  projectId: process.env._PROJECT_ID,
  type: process.env._TYPE,
  project_id: process.env._PROJECT_ID,
  private_key_id: process.env._PRIVATE_KEY_ID,
  private_key: process.env._PRIVATE_KEY,
  client_email: process.env._CLIENT_EMAIL,
  client_id: process.env._CLIENT_ID,
  auth_uri: process.env._AUTH_URI,
  token_uri: process.env._TOKEN_URI,
  auth_provider_x509_cert_url: process.env._AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env._CLIENT_X509_CERT_URL,
  universe_domain: process.env._UNIVERSE_DOMAIN,
});

exports.UploadImage = async ({ file, imagePath }) => {
  try {
    const upload = await storage.bucket(bucketName).file(imagePath);

    await upload.save(file);

    const publicUrl = `${Bucket.default_bucket_public_url}${bucketName}/${imagePath}`;

    return publicUrl;
  } catch (error) {
    console.log("ee", error.message);
  }
};

exports.DeleteImage = async ({ imagePath }) => {
  try {
    const upload = await storage.bucket(bucketName).file(imagePath);

    const deleteImage = await upload.delete();

    return deleteImage;
  } catch (error) {
    console.log("ee", error.message);
  }
};
