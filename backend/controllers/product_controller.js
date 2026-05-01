const errorHandler = require('../utils/errorhandler');
const Product=require('../models/product_model');
const catchAsyncError = require('../middleware/catchasyncerror');
const ApiFeatures = require('../utils/apifeatures');
//getproducts-{{baseurl}}/api/v1/products
exports.getProducts=catchAsyncError( async (req,res,next)=>{
    const resultsPerPage=3;
    const apifeatures=new ApiFeatures(Product.find(), req.query)
                                                                .search()
                                                                .filter()
                                                                .paginate(resultsPerPage);
    //search method is used to filter products based on the keyword provided in the query string.
    
 const product= await apifeatures.query;
      res.status(200).json({
        success:true,
        count:product.length,
        product
        
})}

)
//createproduct-{{baseurl}}/api/v1/products/new
exports.newProduct= catchAsyncError( async (req,res,next)=>{
   req.body.user=req.user.id; // Id of user  who creating product
const product= await Product.create(req.body)
        res.status(201).json({
            success:true,
            product
        })  
    }
 ) //This function creates a new product using the ProductModel and returns the created product in the response.


// to get specific product by id
exports.getSingleproduct= catchAsyncError( async (req,res,next)=>{
 const product= await Product.findById(req.params.id)
 if(!product){
   return next(new errorHandler("Product not found",404)) // If product not found, throw an error
    }
 
    res.status(201).json({
        success:true,
        product
    })
}
)
//updateproduct-{{baseurl}}/api/v1/product/:id
exports.updateProduct= catchAsyncError( async (req,res,next)=>{
    let product= await Product.findById(req.params.id);
    if(!product){ 
       
    }
   product= await Product.findByIdAndUpdate(req.params.id,req .body,{
    new:true,
    runValidators:true
   })
   res.status(200).json({
    success:true,
    product
   })
}
)
//deleteproduct-{{baseurl}}/api/v1/product/:id
exports.deleteProduct= catchAsyncError( async (req,res,next)=>{
    let product= await Product.findById(req.params.id);
    if(!product){ 
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    await Product.findByIdAndDelete(req.params.id);//we using mongoose 7 so remove() was not valid
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
}
)
//create revieww-api/v1/review
exports.createReview= catchAsyncError(async (req,res,next)=>{
    const {productId,rating ,comment}=req.body; 
    const review={
        user:req.user.id,
        rating,
        comment
    }
    //finding user rwview exists
    const product =await Product.findById(productId);
  const isReviewed=product.reviews.find((review)=>{
        return review.user && req.user &&
        review.user.toString()==req.user.id.toString()
    })
    if(isReviewed){
product.reviews.forEach(review =>{
   if(review.user.toString()==req.user.id.toString()){
    review.comment= comment;
    review.rating=rating;
   }
}) 
    }else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
    }
    //finding the average of the reviews
    product.ratings=product.reviews.reduce((acc,review)=>{
        return review.rating+acc;
    },0)/product.reviews.length;

  product.ratings= isNaN( product.ratings)?0:product.ratings;

  await product.save({validatebeforesave:false});

  res.status(200).json({
    success:true
  })
}) 
//GetReviews -api/v1/Reviews?id={product id}
exports.getReviews=catchAsyncError( async (req,res,next)=>{
   
   const product = await Product.findById(req.query.id).populate('reviews.user','name email');
   
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }                                                          
        res.status(200).json({
        success:true,
        count:product.reviews.length,
        reviews:product.reviews
        
})})
//DeleteReview -api/v1/review
exports.deleteReview= catchAsyncError( async (req,res,next)=>{
    let product= await Product.findById(req.query.productId);
    //filtering the reviews which does mmatch the deleting review id
    const reviews=product.reviews.filter(review=>{
     return   review._id.toString()!==req.query.id.toString()
    })
    //number of reviews
    const numOfReviews=reviews.length;
    //finding the average with the filtered reviews
    let ratings=reviews.reduce((acc,review)=>{
        return review.rating+acc;
    },0)/reviews.length;

    ratings= isNaN(ratings)?0:ratings;
    //save the product details
await Product.findByIdAndUpdate(req.query.productId,
    {reviews,
    numOfReviews,
    ratings})
       res.status(200).json({
        success:true,
       
    })
}
)