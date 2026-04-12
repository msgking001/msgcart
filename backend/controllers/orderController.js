const catchasyncerror = require("../middleware/catchasyncerror");
const orderModel = require("../models/order_model");
const errorHandler =require("../utils/errorhandler");
const Product=require('../models/product_model');
//Creating New Order-api/v1/order/new
exports.newOrder = catchasyncerror(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemPrices,
    taxPrices,
    shippingPrice,
    TotalPrice,
    paymentInfo
  } = req.body;

  const order = await orderModel.create({
    orderItems,
    shippingInfo,   
    itemPrices,     
    taxPrices,      
    shippingPrice,
    TotalPrice,    
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id
  });

  res.status(200).json({
    success: true,
    order
  });
});
//Get single order -/api/v1/order/new
exports.getSingleOrder= catchasyncerror( async (req,res,next)=>{
 const order= await orderModel.findById(req.params.id)
 if(!order){
   return next(new errorHandler("Oreder not found",404)) // If product not found, throw an error
    }
 
    res.status(201).json({
        success:true,
        order
    })
}
)
//GetloggedinUser order -/api/v1/myorders
exports.myOrders=catchasyncerror(async(req,res,next)=>{
    const orders= await orderModel.find({user:req.user.id});
    res.status(200).json({
        success:true,
        orders
    })
})
//Admin: Get all orders -/api/v1/admin/orders
exports.getAllOrders=catchasyncerror(async (req,res,next)=>{
 const order= await orderModel.find();
 let totalAmount= 0;
 order.forEach((order)=>{
    totalAmount+= order.TotalPrice
 })
res.status(201).json({
        success:true,
        totalAmount,
        order
    })
}
)
//Admin: update order status -/api/v1/admin/order/:id
exports.updateOrder=catchasyncerror(async(req,res,next)=>{
    const order= await orderModel.findById(req.params.id);
    if(!order){
        return next(new errorHandler("Order not found with this id",404))
    }
    if(order.orderStatus==="Delivered"){
        return next(new errorHandler("You have already delivered this order",400))
    }
    //updating the stock of each ordered item
    order.orderItems.forEach(async item =>{
        
        await updateStock(item.product,item.quantity);
    })
    order.orderStatus=req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        
    })
})
async function updateStock(id,quantity){
    const product= await Product.findByIdAndUpdate(id);
   
    product.stock=product.stock-quantity;
    await product.save({validateBeforeSave:false});
}
//Admin: Delete Order -api/v1/order/:id
exports.deleteOrder =catchasyncerror( async(req,res,next)=>{
    const order =await orderModel.findById(req.params.id);
    if(!order){
   return next(new errorHandler("Order not found",404)) // If product not found, throw an error
    }
   await orderModel.findByIdAndDelete(req.params.id);//we using mongoose 7 so remove() was not valid
//await is important for req success
 res.status(201).json({
    success: true,
    message:"order deleted"
 })
})