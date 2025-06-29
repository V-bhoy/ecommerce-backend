import * as ProductModel from "../models/product.model.js";
import * as ReviewModel from "../models/review.model.js";
import {countMaxVotes} from "../util/count-max-votes.js";

export const addProductReview = async(req, res)=>{
    const {productId, review, rating, fit, length, transparency} = req.body;
    const userId = req.user.id;
    if(!productId){
        return res.status(400).json({
            success: false,
            message: "Invalid Product Id"
        })
    }
    try {
        const existing = await ProductModel.getProductById(productId);
        if(!existing){
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }
        if(isNaN(rating) || isNaN(fit) || isNaN(length) || isNaN(transparency)){
            return res.status(400).json({
                success: false,
                message: "Invalid Request Data!"
            })
        }
        await ReviewModel.saveReview({
            customer_id: userId,
            product_id: productId,
            review,
            rating,
            fit,
            length,
            transparency
        })

        return res.status(200).json({
            success: true,
            message: "Added review successfully!"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const getProductReviewStats = async(req, res)=>{
    const {productId} = req.params;
    if(!productId){
        return res.status(400).json({
            success: false,
            message: "Invalid Product Id"
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
        const totalCount = ReviewModel.countProductReviews(productId);
        const countFit1 = ReviewModel.countProductVote(productId, "fit", 1);
        const countFit2 = ReviewModel.countProductVote(productId, "fit", 2);
        const countFit3 = ReviewModel.countProductVote(productId, "fit", 3);
        const countFit4 = ReviewModel.countProductVote(productId, "fit", 4);
        const countFit5 = ReviewModel.countProductVote(productId, "fit", 5);
        const countLength1 = ReviewModel.countProductVote(productId, "length", 1);
        const countLength2 = ReviewModel.countProductVote(productId, "length", 2);
        const countLength3 = ReviewModel.countProductVote(productId, "length", 3);
        const countLength4 = ReviewModel.countProductVote(productId, "length", 4);
        const countLength5 = ReviewModel.countProductVote(productId, "length", 5);
        const countTransparency1 = ReviewModel.countProductVote(productId, "transparency", 1);
        const countTransparency2 = ReviewModel.countProductVote(productId, "transparency", 2);
        const countTransparency3 = ReviewModel.countProductVote(productId, "transparency", 3);
        const countTransparency4 = ReviewModel.countProductVote(productId, "transparency", 4);
        const countTransparency5 = ReviewModel.countProductVote(productId, "transparency", 5);

        const [[total], [fit1], [fit2], [fit3], [fit4],[fit5]]= await Promise.all([totalCount, countFit1, countFit2, countFit3, countFit4, countFit5])
        const [ [length1], [length2], [length3], [length4], [length5]] = await Promise.all([countLength1, countLength2, countLength3, countLength4, countLength5])
        const [[t1], [t2], [t3], [t4], [t5]] = await Promise.all([countTransparency1, countTransparency2, countTransparency3, countTransparency4, countTransparency5]);

        const maxFitVote = countMaxVotes(total.count, [fit1.count, fit2.count, fit3.count, fit4.count, fit5.count]);
        const maxLengthVote = countMaxVotes(total.count, [length1.count, length2.count, length3.count, length4.count, length5.count]);
        const maxTransparencyVote = countMaxVotes(total.count, [t1.count, t2.count, t3.count, t4.count, t5.count]);

        res.status(200).json({
            success: true,
            maxFitVote: {
                title: "Fit",
                ...maxFitVote
            },
            maxLengthVote: {
                title: "Length",
                ...maxLengthVote
            },
            maxTransparencyVote: {
                title: "Transparency",
                ...maxTransparencyVote
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

export const getProductReviews = async(req, res)=>{
    const {productId} = req.params;
    if(!productId){
        return res.status(400).json({
            success: false,
            message: "Invalid Product Id"
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

        const reviews = await ReviewModel.getProductReviews(productId);

        res.status(200).json({
            success: true,
            reviews
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}