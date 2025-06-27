import appConfig from "../index.js";

const {db} = appConfig;

export const findBySkuId = (skuId)=>db("product_variants")
    .select("*").where({sku_id: skuId}).first();

export const findAllByProductId = (id)=>db("product_variants")
    .select("*").where({product_id: id});

export const findInStockVariantsByProductId = (id)=>db("product_variants")
    .select("*").where({product_id: id}).where("qty", ">", 0);


export const countInStockVariantsByProductId = (id)=>db("product_variants")
    .countDistinct("id as count").where({product_id: id}).where("qty", ">", 0);

export const save = (data)=>db("product_variants").insert(data).returning("sku_id");