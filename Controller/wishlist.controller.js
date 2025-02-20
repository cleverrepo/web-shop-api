const Wishlist = require("../Model/wishlist.model.js");
const Product = require("../Model/product.model.js");

exports.addWishlistItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

   
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const wishlistItem =  Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({ message: "Product added to wishlist", wishlistItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product to wishlist", error: error.message });
  }
};

exports.getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch wishlist for the user and populate product details
    const wishlist = await Wishlist.find({ userId }).populate("productId", "name price");

    if (!wishlist.length) {
      return res.status(404).json({ message: "No items in wishlist" });
    }

    res.status(200).json({ message: "Wishlist fetched successfully", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
  }
};

exports.removeWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove a product from the wishlist
    const wishlistItem = await Wishlist.findByIdAndDelete(id);
    if (!wishlistItem) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item from wishlist", error: error.message });
  }
};
