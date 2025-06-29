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

export const getAllOrders = (userId) =>
    db("orders as o")
        .select(
            "o.*",
            db.raw(`COALESCE(json_agg(json_build_object(
        'id', i.id,
        'sku_id', i.sku_id,
        'qty', i.qty,
        'mrp', i.mrp,
        'discount', i.discount,
        'item_price', i.item_price,
        'title', p.title
      ) ORDER BY i.id), '[]') as items`)
        )
        .leftJoin("order_items as i", "o.id", "i.order_id")
        .leftJoin("products as p", "i.product_id", "p.id")
        .where("o.customer_id", userId)
        .groupBy("o.id");