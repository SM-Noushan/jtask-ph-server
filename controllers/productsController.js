const getProductsCollection = require("../models/productsModel");

// Function to generate a random date
function generateRandomDate() {
  const start = new Date(2024, 0, 1); // Starting date
  const end = new Date(); // Current date
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString(); // Convert to ISO string
}

// Retrieve all tasks
const getAllProducts = async (req, res) => {
  const searchTerm = req.query?.search || "";
  // Create a case-insensitive regex for partial matching
  const regex = new RegExp(searchTerm, "i"); // 'i' for case-insensitive
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
  const products = await productsCollection
    .find({ title: { $regex: regex } }, { projection })
    .toArray();
  res.json(products);
};

module.exports = {
  getAllProducts,
};
