const getProductsCollection = require("../models/productsModel");

// Retrieve all tasks
const getAllProducts = async (req, res) => {
  const productsCollection = await getProductsCollection();
  const projection = {
    title: 1,
    description: 1,
    category: 1,
    price: 1,
    rating: 1,
    brand: 1,
    meta: { createdAt: 1 },
    thumbnail: 1,
  };
  const products = await productsCollection.find({}, { projection }).toArray();
  res.json(products);
};

module.exports = {
  getAllProducts,
};
