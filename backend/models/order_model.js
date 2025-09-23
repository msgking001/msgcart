const mongoose=require('mongoose');
const orderSchema= new mongoose.Schema( //new keyword is important for creating class(.X.)
    {
        shippingInfo:{
            address:{
                type:String,
                required:true
            },
            country:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            phoneNo:{
                type:String,
                required:true
            },
            postalCode:{
                type:String,
                required:true
            },
        },
        user:{
            type:mongoose.SchemaTypes.ObjectId,
            required:true,
            ref:'User'
        },
        orderItems:[
            {
                name:{
                    type:String,
                    
                },
                quantity:{
                    type:Number,
                    required:true
                },
                 image:{
                    type:String,
                    required:true
                },
                prices: {
                    type:Number,
                    required:true
                },
                product: {
                    type:mongoose.SchemaTypes.ObjectId,
                    require:true,
                    ref: 'Product'
                }
                
            }
        ],
        itemPrices:{
                type:Number,
                required: true,
                default:0.0
        },
        taxPrices:{
             
                type:Number,
                required: true,
                default:0.0
    
        },
         shippingPrice:{
                type:Number,
                required: true,
                default:0.0
        },
         TotalPrice:{
                type:Number,
                required: true,
                default:0.0
        },
        paidAt:{
            type:Date
        },
         deliveredAt:{
            type:Date
        },
         orderStatus:{
            type:String,
            required:true,
            default:'Processing'
        },
        createdAt:{
            type:Date,
            default: Date.now
        }

    }
)
let orderModel=mongoose.model("order",orderSchema);
module.exports=orderModel