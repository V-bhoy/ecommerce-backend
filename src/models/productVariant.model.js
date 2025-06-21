import appConfig from "../index.js";

const {db} = appConfig;

export const findBySkuId = (skuId)=>db("product_variants")
    .select("*").where({sku_id: skuId}).first();

export const findAllByProductId = (id)=>db("product_variants")
    .select("*").where({product_id: id});

export const save = (data)=>db("product_variants").insert(data).returning("sku_id");