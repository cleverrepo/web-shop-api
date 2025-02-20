const express = require("express");
const wishRouter = express.Router();
const wishlistController = require("../Controller/wishlist.controller.js");

wishRouter.post("/", wishlistController.addWishlistItem); 
wishRouter.get("/:userId", wishlistController.getUserWishlist); 
wishRouter.delete("/:id", wishlistController.removeWishlistItem); 

module.exports = wishRouter;
