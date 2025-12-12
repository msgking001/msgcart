const express = require('express');
const router = express.Router();
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/authenticate");
const { newOrder,getSingleOrder ,myOrders,getAllOrders,updateOrder, deleteOrder} = require('../controllers/orderController');

router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//Adminroutes
router.route('/orders').get(isAuthenticatedUser,authorizeRoles('admin'),getAllOrders);
router.route('/orders/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
                            .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);
module.exports=router;
