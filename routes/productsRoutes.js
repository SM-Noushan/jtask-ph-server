const express = require("express");
const {
  getAllProducts,
  getAllProductsCount,
} = require("../controllers/productsController");

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/totalProductsCount", getAllProductsCount);

module.exports = router;
