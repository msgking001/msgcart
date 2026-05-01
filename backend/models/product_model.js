const mongoose= require('mongoose');
const productSchema = new mongoose.Schema( //create new product on every call.
    {
        name:{//setting field like mysql
            type:String,//data_type
            required:[true,"Please enter product name"],//primary_key
            trim:true,//for removing extra spaces
            maxlength:[100,"Product name cannot exceed 100 characters"]
        },
        price:{
            type:Number,
            default:0.0,
        },
        description:{
            type:String,
            required:[true,"Please enter product description"]
    },
    ratings:{
        type:String,
        default:0
    },
    images:[{
        image:{
            type:String,
            required:true
        }
        }
    ],
    category:{
        type:String,
        required:[true,"Please enter product category"],
        enum:{ //enum is used to set the values of category
            values:['Electronics','Mobile','Laptops','Accessories','Headphones','Food','Books','Clothes','Beauty','Sports','Outdoor','Home'],
           
        },
         message:"Please select correct category for product"

},
        seller:{
            type:String,
            required:[true,"Please enter product seller"]
        },
        stock:{
            type:Number,
            required:[true,"Please enter product stock"],
            maxlength:[20,"Stock cannot exceed 20"],
        },
        numOfReviews:{
            type:Number,
             default:0
        },
        reviews:[
            {
            user:mongoose.Schema.Types.ObjectId,
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true}}
        ],
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User" //reference to User model
        },
        createdAt:{
            type:Date,
            default:Date.now()
        }
})
let Schema=mongoose.model("Product",productSchema); //create a model for product
module.exports=Schema; //export the model
//This code defines a Mongoose schema for a product, including fields like name, price etc...