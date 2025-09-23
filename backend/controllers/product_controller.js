const errorHandler = require('../utils/errorhandler');
const Product=require('../models/product_model');
const catchAsyncError = require('../middleware/catchasyncerror');
const ApiFeatures = require('../utils/apifeatures');
//getproducts-{{baseurl}}/api/v1/products
exports.getProducts=catchAsyncError( async (req,res,next)=>{
    const resultsPerPage=2;
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