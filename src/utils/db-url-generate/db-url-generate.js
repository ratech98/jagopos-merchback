exports.generateUrl = (merchant_phone_number) => {
  const username = process.env._DB_USER_NAME;
  const password = process.env._DB_PASSWORD;
  const cluster = process.env._DB_CLUSTER;
  const appName = process.env._DB_APP_NAME;

  return `mongodb+srv://${username}:${password}@${cluster}/${merchant_phone_number}?retryWrites=true&w=majority&appName=${appName}`;
};
