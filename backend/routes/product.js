const express=require('express');
const { getProducts, newProduct, getSingleproduct, updateProduct, deleteProduct } = require('../controllers/product_controller');
const router=express.Router();
const  {isAuthenticatedUser, authorizeRoles}  = require('../middleware/authenticate');
router.route('/products').get( isAuthenticatedUser,getProducts);
router.route('/products/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);
router.route('/product/:id')
                            .get(getSingleproduct)// Assuming you want to get a product by ID
                            .put(updateProduct) // Assuming you want to update a product by ID
                            .delete(deleteProduct); // Assuming you want to delete a product by ID
module.exports=router;