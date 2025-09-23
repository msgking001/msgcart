const connectdatabase = require('../config/database');
const products=require('../data/product.json');
const ProductModel = require('../models/product_model');
const dotenv = require('dotenv');
const path = require('path');
// Load environment variables from config.env

dotenv.config({ path: path.join(__dirname, '../config/config.env') });
connectdatabase(); // Connect to the database
const seedproducts = async () => {
    try {
    await ProductModel.deleteMany(); // Clear existing products
      console.log("Products Deleted successfully");
  await ProductModel.insertMany(products); // Insert new products
  console.log("Products seeded successfully");
} catch (error) {
    console.error("Error seeding products:", error.message);
}
process.exit(); // Exit the process after seeding
};
seedproducts()