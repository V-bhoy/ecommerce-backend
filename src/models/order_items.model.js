import appConfig from "../index.js";

const {db} = appConfig;

export const addOrderItems = (items)=>db("order_items").insert(items);

export const getOrderedItemsById = (orderId)=>db("order_items").select("*").where({
    order_id: orderId
})