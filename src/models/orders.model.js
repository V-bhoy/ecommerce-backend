import appConfig from "../index.js";

const {db} = appConfig;

export const createOrder = (order)=>db("orders").insert(order).returning("id");

export const updateOrder = (data, updateBy)=>db("orders").update({
    ...data,
    updated_at: new Date()
}).where(updateBy)

export const getOrderId = (razorPayOrderId) => db("orders")
    .select("id")
    .where({razorpay_order_id: razorPayOrderId})
    .first();