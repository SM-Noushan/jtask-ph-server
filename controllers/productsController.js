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
  const searchTerm = req.query?.search || ""; //Get search value from query parameters
  const minPrice = parseFloat(req.query?.minPrice) || 0; // Get minPrice from query parameters
  const maxPrice = parseFloat(req.query?.maxPrice) || 2500; // Get maxPrice from query parameters
  const brands = req.query?.brand ? req.query.brand.split(",") : []; // Get selected brands from query parameters

  // Create a case-insensitive regex for partial matching
  const regex = new RegExp(searchTerm, "i"); // 'i' for case-insensitive
  // Build the query filter
  let filter = {
    title: { $regex: regex },
    price: { $gte: minPrice, $lte: maxPrice },
  };

  // Add brand filter if any brands are selected
  if (brands?.length > 0) {
    filter.brand = { $in: brands }; // Filter products where the brand is in the selected list
  }

  const productsCollection = await getProductsCollection();
  const itemCount = await productsCollection.countDocuments(filter);
  res.json({ itemCount });
};

// retrieve all products
const getAllProducts = async (req, res) => {
  const searchTerm = req.query?.search || ""; //Get search value from query parameters
  const pageNo = parseInt(req.query?.page) || 1; //Get currentPageNo value from query parameters
  const sortOption = req.query?.sort || "default"; //Get sortBy value from query parameters
  const minPrice = parseFloat(req.query?.minPrice) || 0; // Get minPrice from query parameters
  const maxPrice = parseFloat(req.query?.maxPrice) || 2500; // Get maxPrice from query parameters
  const brands = req.query?.brand ? req.query.brand.split(",") : []; // Get selected brands from query parameters

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

  // Build the query filter
  let filter = {
    title: { $regex: regex },
    price: { $gte: minPrice, $lte: maxPrice },
  };

  // Add brand filter if any brands are selected
  if (brands?.length > 0) {
    filter.brand = { $in: brands }; // Filter products where the brand is in the selected list
  }

  const products = await productsCollection
    .find(filter, { projection })
    .sort(sortCriteria)
    .skip((pageNo - 1) * 6)
    .limit(6)
    .toArray();
  res.json(products);
};

// get category and brand
const getCategoryAndBrand = async (req, res) => {
  const productsCollection = await getProductsCollection();
  const result = await productsCollection
    .aggregate([
      {
        $group: {
          _id: null, // Grouping all documents together
          categories: { $addToSet: "$category" }, // Add unique categories to an array
          brands: { $addToSet: "$brand" }, // Add unique brands to an array
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          categories: 1,
          brands: 1,
        },
      },
    ])
    .toArray();

  res.json(result);
};

module.exports = {
  getAllProducts,
  getAllProductsCount,
  getCategoryAndBrand,
};
