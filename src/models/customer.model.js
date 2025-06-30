import appConfig from "../index.js";

const {db} = appConfig;

export const findByEmail = (email)=>db("customers")
    .select("*")
    .where({email})
    .first();

export const updateAddress = (data, email)=>db("customers")
    .update({...data, updated_at: db.fn.now()}).where({email});

export const save = (data)=>db("customers").insert(data).returning("id");

export const updatePassword = (user)=>db("customers")
    .update({password: user.password, updated_at: db.fn.now()})
    .where("email", user.email);