const getProductsCollection = require("../models/productsModel");

// Function to generate a random date
function generateRandomDate() {
  const start = new Date(2024, 0, 1); // Starting date
  const end = new Date(); // Current date
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString(); // Convert to ISO string
}

// retrieve product count
const getAllProductsCount = async (req, res) => {
  const searchTerm = req.query?.search || "";
  // Create a case-insensitive regex for partial matching
  const regex = new RegExp(searchTerm, "i"); // 'i' for case-insensitive
  const productsCollection = await getProductsCollection();
  const itemCount = await productsCollection.countDocuments({
    title: { $regex: regex },
  });
  res.json({ itemCount });
};

// retrieve all products
const getAllProducts = async (req, res) => {
  const searchTerm = req.query?.search || "";
  const pageNo = parseInt(req.query?.page) || 1;
  const sortOption = req.query?.sort || "default";

  // Define sorting criteria
  let sortCriteria = {}; // Default (no sorting)
  if (sortOption === "priceAsc") {
    sortCriteria = { price: 1 }; // Price (Low to High)
  } else if (sortOption === "priceDesc") {
    sortCriteria = { price: -1 }; // Price (High to Low)
  } else if (sortOption === "Date") {
    sortCriteria = { "meta.createdAt": -1 }; // Date (Newest First)
  }

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
  // console.log(sortOption);
  const products = await productsCollection
    .find({ title: { $regex: regex } }, { projection })
    .sort(sortCriteria)
    .skip((pageNo - 1) * 6)
    .limit(6)
    .toArray();
  res.json(products);
};

module.exports = {
  getAllProducts,
  getAllProductsCount,
};
