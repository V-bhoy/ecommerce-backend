import * as ProductModel from "../models/product.model.js";
import * as ProductVariantModel from "../models/productVariant.model.js";

export const createProductVariant = async (req, res)=>{
    const {productId, qty, size} = req.body;
    if(!productId){
        return res.status(400).json({
            success: false,
            message: "Product Id is required!"
        })
    }
    try{
        const existing = await ProductModel.getProductById(productId);
        if(!existing){
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }
        const [{sku_id}] = await ProductVariantModel.save({
            product_id: productId,
            qty: qty < 0 ? 0 : qty,
            size
        })
        return res.status(200).json({
            success: true,
            message: `Sku variant created with skuId - ${sku_id}!`
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        })
    }
}

export const getAllProductVariants = async(req, res)=>{
    const {productId} = req.params;
    if(!productId || isNaN(productId)){
        return res.status(400).json({
            success: false,
            message: "Valid product Id is required!"
        })
    }
    try{
        const existing = await ProductModel.getProductById(productId);
        if(!existing){
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }
        const data = await ProductVariantModel.findAllByProductId(productId);
        return res.status(200).json({
            success: true,
            variants: data
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!"
        })
    }
}