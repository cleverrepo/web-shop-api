const mongoose = require("mongoose");
const Product = require("../Model/product.model.js");

module.exports = {
  addProduct: async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Product failed to be added due to an error", error });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({});
      res
        .status(200)
        .json({ message: "All products fetched successfully", products });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to fetch all products due to an error", error });
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res
        .status(200)
        .json({ message: "Product fetched successfully", product });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to fetch product due to an error", error });
    }
  },
  updateProductById: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res
        .status(200)
        .json({ message: "Product updated successfully", product });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to update product due to an error", error });
    }
  },
  deleteProductById: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to delete product due to an error", error });
    }
  },
   searchResult: async (req, res) => {
    try {
      const { key } = req.params; // Get the search key from route parameters
  
      // Validate that 'key' is provided
      if (!key) {
        return res.status(400).json({ error: "'key' parameter is required" });
      }
  
      const result = await Product.aggregate([
        {
          $search: {
            index: "e-commerce", 
            text: {
              query: key, 
              path: {
                wildcard: "*", 
              },
            },
          },
        },
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No matching jobs found" });
      }
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

  