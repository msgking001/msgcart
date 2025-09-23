const express = require('express');
const router = express.Router();
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/authenticate");
const { newOrder,getSingleOrder ,myOrders,getAllOrders} = require('../controllers/orderController');

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Adminroutes
router.route('/orders').get(isAuthenticatedUser,authorizeRoles('admin'),getAllOrders);
module.exports=router;
