const  mongoose = require("mongoose")

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
    currency: {
      type: String,
      default: "USD",
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
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    sku: {
      type: String,
      unique: true,
    },
    dimensions: {
      length: { type: Number, required: false },
      width: { type: Number, required: false },
      height: { type: Number, required: false },
    },
    weight: {
      type: Number,
      required: false,
    },
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
