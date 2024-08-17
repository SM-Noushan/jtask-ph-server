const connectDB = require("../config/db");

const getProductsCollection = async () => {
  const db = await connectDB();
  return db.collection("products");
};

module.exports = getProductsCollection;
