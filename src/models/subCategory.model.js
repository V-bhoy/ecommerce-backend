import appConfig from "../index.js";

const {db} = appConfig;

export const findById = (id)=> db("sub_categories")
    .select("*").where({id}).first();

export const findByName = (name)=>db("sub_categories")
    .select("*").where({name: name.toUpperCase()}).first();

export const save = (data)=>db("sub_categories").insert(data).returning("id");

export const findAll = ()=>db("sub_categories").select("*");