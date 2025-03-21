const mongoose = require("mongoose");

const myProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the product name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    category: {
      type: String,
      required: [true, "Please specify the product category"],
    },
    brand: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: false,
    },

    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, required: false },
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category", 
      required: [true, "Please specify the product category"],
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    shippingCost: {
      type: Number,
      default: 0,
    },
    deliveryOptions: [
      {
        type: { type: String, required: false },
        cost: { type: Number, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", myProductSchema);
module.exports = Product;
