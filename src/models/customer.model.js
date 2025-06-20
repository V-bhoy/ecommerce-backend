import appConfig from "../index.js";

const {db} = appConfig;

export const findById = (id)=>db("customers")
    .select("*")
    .where({id})
    .first();

export const findByEmail = (email)=>db("customers")
    .select("*")
    .where({email})
    .first();

export const findAll = ()=>db("customers").select("*");

export const save = (data)=>db("customers").insert(data).returning("id");

export const updatePassword = (user)=>db("customers")
    .update({password: user.password, updated_at: db.fn.now()})
    .where("email", user.email);