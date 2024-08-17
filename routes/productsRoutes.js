const express = require("express");
const {
  getAllProducts,
  getAllProductsCount,
  getCategoryAndBrand,
} = require("../controllers/productsController");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/totalProductsCount", getAllProductsCount);
router.get("/categoriesAndBrands", getCategoryAndBrand);

module.exports = router;
