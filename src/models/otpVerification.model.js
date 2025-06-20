import appConfig from "../index.js";

const {db} = appConfig;

export const save = (data)=>db("otp_verification")
    .insert(data)
    .onConflict("customer_id").
    merge({...data, updated_at: db.fn.now()});

export const findByCustomerId=(id)=>db("otp_verification")
    .select("*")
    .where("customer_id", id).first();