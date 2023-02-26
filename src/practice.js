const cartModel = require("../../Project-05/src/model/cartModel")
const productModel = require("../../Project-05/src/model/productModel")
const { findById } = require("./models/bookModel")
const { findByIdAndUpdate } = require("./models/userModel")

  {

let body= req.body //quantity,productid,cart
let params = req.params.userId

findproduct= await productModel.findById({productid})

if(body.cartid){
    checkcart=await cartModel.findById(body.cartid)
    if(checkcart){
        for(let i= 0)
        if(checkcart.productid==body.productModel){
            totalprice=checkcart.totalprice+findproduct.totalprice

        }
    }
}

  }
 
findByIdAndUpdate(_____,{$pull:{           }},new:true)
 