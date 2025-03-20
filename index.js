// importing third party libraries from .json

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Load environment variables
dotenv.config();


const productRoutes = require('./Routes/product.routes.js');
const cartRoutes = require('./Routes/cart.routes.js');
const bookmarkRoutes = require('./Routes/bookmark.routes.js');
const wishRouter = require('./Routes/wishlist.route.js')
const userRouter = require('./Routes/user.routes.js'); 
const adminRoutes = require('./Controller/adminAuth.js');
const cors=require("cors")

const port = process.env.PORT || 3000;

// Middleware
// allows to access flutter
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5000', 'https://web-shop-api-dzze.onrender.com']
}));

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist',wishRouter)
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRoutes);



// Connect to MongoDB and if successful, start the server otherwise throw and error 
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
  });
