const Bookmark = require('../Model/bookmark.model.js');
const Product = require('../Model/product.model.js');   

exports.addBookmark = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({ userId, productId });
    if (existingBookmark) {
      return res.status(400).json({ message: "Bookmark already exists for this user" });
    }

    // Create and save the new bookmark
    const bookmark = new Bookmark({ userId, productId });
    await bookmark.save();

    res.status(201).json({ message: "Bookmark added successfully", bookmark });
  } catch (error) {
    res.status(500).json({ message: "Failed to add bookmark", error: error.message });
  }
};
exports.getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
   

    const bookmarks = await Bookmark.find({ userId }).populate("productId", "name price");


    if (!bookmarks.length) {
      return res.status(404).json({ message: "No bookmarks found for this user" });
    }

    res.status(200).json({ message: "Bookmarks fetched successfully", bookmarks });
  } catch (error) {
    
    res.status(500).json({ message: "Failed to fetch bookmarks", error: error.message });
  }
};

  
exports.deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the bookmark by its ID
    const bookmark = await Bookmark.findByIdAndDelete(id);
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bookmark", error: error.message });
  }
};
