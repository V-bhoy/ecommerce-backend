import appConfig from "../index.js";

const {db} = appConfig;

export const findByIdAndCategoryId = (id, categoryId)=> db("sub_categories")
    .select("*").where({id, category_id: categoryId}).first();

export const findByNameAndCategoryId = (name, categoryId)=>db("sub_categories")
    .select("*").where({name: name.toUpperCase(), category_id: categoryId}).first();

export const save = (data)=>db("sub_categories").insert(data).returning("id");

export const findAll = ()=>db("sub_categories as s").select("s.id", "s.name", "c.name as categoryName")
    .leftJoin("categories as c", "s.category_id", "c.id");