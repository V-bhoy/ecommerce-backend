import appConfig from "../index.js";

const {db} = appConfig;

export const saveReview = (data)=>db("reviews").insert(data).returning("id");

export const getProductReviews = (productId)=>db("reviews as r")
    .select("r.id","r.review", "r.rating", "r.created_at", "c.first_name", "c.last_name")
    .leftJoin("customers as c", "r.customer_id", "c.id")
    .where("product_id", productId)

export const countProductReviews = (productId)=>db("reviews")
    .countDistinct("id as count").where("product_id", productId);

export const countProductVote = (productId, column, value)=>db("reviews")
    .countDistinct("id as count").where({
        product_id: productId,
        [column]: value
    });

export const getProductAverageRating = (productId) =>
    db("reviews")
        .where("product_id", productId)
        .avg("rating as average_rating")
        .first();