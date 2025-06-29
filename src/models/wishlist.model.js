import appConfig from "../index.js";

const {db} = appConfig;

export const addToWishlist = (data)=> db("wishlist").insert(data).returning("id");
export const removeFromWishlist = (userId, productId)=> db("wishlist").delete().where({
    customer_id: userId,
    product_id: productId
});
export const findWishlist = (userId, productId)=>db("wishlist")
    .select("id")
    .where({
    customer_id: userId,
    product_id: productId
    }).first();

