const express = require("express");
const Controller = require("../Controller/product.controller.js");
const routes = express.Router();

routes.post("/", Controller.addProduct);
routes.get("/", Controller.getAllProducts);
routes.get("/:id", Controller.getProductById);
 routes.get("/search/:key", Controller.searchResult);
routes.put("/:id", Controller.updateProductById);
routes.delete("/:id", Controller.deleteProductById);

module.exports = routes;
