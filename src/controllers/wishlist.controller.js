import * as WishlistModel from "../models/wishlist.model.js";

export const wishlistProduct = async(req, res)=>{
    const {productId} = req.body;
    const userId = req.user.id;
    if(!userId || !productId){
        return res.status(400).json({
            success: false,
            message: "Invalid userId or productId!"
        })
    }
    try{
        const existing = await WishlistModel.findWishlist(userId, productId);
        if(existing){
            return res.status(400).json({
                success: false,
                message: "Already wishlisted!"
            })
        }

        await WishlistModel.addToWishlist({
            customer_id: userId,
            product_id: productId});

        return res.status(200).json({
            success: true,
            message: "Added to wishlist successfully"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const removeWishlistProduct = async(req, res)=>{
    const {productId} = req.body;
    const userId = req.user.id;
    if(!userId || !productId){
        return res.status(400).json({
            success: false,
            message: "Invalid userId or productId!"
        })
    }
    try{

        await WishlistModel.removeFromWishlist(userId, productId);

        return res.status(200).json({
            success: true,
            message: "Removed from wishlist successfully"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

