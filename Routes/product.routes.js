const express = require("express");
const Controller = require("../Controller/product.controller.js");
const routes = express.Router();

// Add a product
routes.post("/products", Controller.addProduct);

// Fetch all products
routes.get("/products", Controller.getAllProducts);

// Fetch products by category (GET request)
routes.get("/products/category/:category", Controller.getByCategory); // Correct route

// Add a category
routes.post("/categories", Controller.createCategory);

// Fetch a product by ID
routes.get("/products/:id", Controller.getProductById);

// Search products
routes.get("/products/search/:key", Controller.searchResult);

// Update a product by ID
routes.put("/products/:id", Controller.updateProductById);

// Delete a product by ID
routes.delete("/products/:id", Controller.deleteProductById);

module.exports = routes;