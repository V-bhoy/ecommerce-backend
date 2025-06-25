import appConfig from "../index.js";

const {db} = appConfig;

export const findById = (id)=> db("categories")
    .select("*").where({id}).first();

export const findByName = (name)=>db("categories")
    .select("*").where({name: name.toUpperCase()}).first();

export const save = (data)=>db("categories").insert(data).returning("id");

export const findAll = ()=>db("categories").select("id", "name");