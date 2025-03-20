const mongoose = require("mongoose");
const Product = require("../Model/product.model.js");
const Category = require("../Model/product.category.js"); // Correct import

module.exports = {
  addProduct: async (req, res) => {
    try {
      const { name, description, category, price, quantity, images } = req.body;

      // Check if the category exists in the Category collection
      const existingCategory = await Category.findOne({ name: category });
      if (!existingCategory) {
        return res.status(400).json({ message: "Invalid category. Please provide a valid category name." });
      }

      // Create the product and link it to the valid category
      const product = new Product({
        name,
        description,
        category: existingCategory._id, // Link to the valid category
        price,
        quantity,
        images,
      });

      await product.save();
      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      res.status(400).json({ message: "Product failed to be added due to an error", error });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      // Fetch all products and populate the category details
      const products = await Product.find({}).populate("category");
      res.status(200).json({ message: "All products fetched successfully", products });
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch all products due to an error", error });
    }
  },

  getProductById: async (req, res) => {
    try {
      // Fetch a product by ID and populate the category details
      const product = await Product.findById(req.params.id).populate("category");
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product fetched successfully", product });
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch product due to an error", error });
    }
  },

  updateProductById: async (req, res) => {
    try {
      // Update a product by ID
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate("category"); // Populate category details after update
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
      res.status(400).json({ message: "Failed to update product due to an error", error });
    }
  },

  deleteProductById: async (req, res) => {
    try {
      // Delete a product by ID
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete product due to an error", error });
    }
  },

  searchResult: async (req, res) => {
    try {
      const { key } = req.params; // Get the search key from route parameters

      // Validate that 'key' is provided
      if (!key) {
        return res.status(400).json({ error: "'key' parameter is required" });
      }

      // Perform a search using MongoDB's $search (requires Atlas Search or similar)
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
        return res.status(404).json({ message: "No matching products found" });
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      // Create a new category
      const category = new Category(req.body);
      await category.save();
      res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getByCategory: async (req, res) => {
    try {
      const { category } = req.params;

      // Find the category by name
      const existingCategory = await Category.findOne({ name: category });
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Fetch products that belong to the specified category
      const products = await Product.find({ category: existingCategory._id }).populate("category");
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found in this category" });
      }

      res.status(200).json({ message: "Products fetched successfully", products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products due to an error", error: error.message });
    }
  },
};