import appConfig from "../index.js";

const {db} = appConfig;

const getProductById = (id)=>db("products")
    .select("*")
    .where({id})
    .first();

const getAllProducts = ()=>db("products").select("*");

const saveProduct = (data)=>db("products").insert(data).returning("id")

export {
    getProductById,
    getAllProducts,
    saveProduct
}