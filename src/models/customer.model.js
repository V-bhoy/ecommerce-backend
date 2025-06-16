import appConfig from "../index.js";

const {db} = appConfig;

const getCustomerById = (id)=>db("customers")
    .select("*")
    .where({id})
    .first();

const getAllCustomers = ()=>db("customers").select("*");

export {
    getCustomerById,
    getAllCustomers
}