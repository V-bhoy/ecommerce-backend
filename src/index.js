import express from "express";
import "dotenv/config.js";
import cors from "cors";
import {createDB} from "./db/knex.js";

const env = process.env.NODE_ENV || "development";
const db = createDB({env});
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());



const appConfig = {
    app,
    db,
    env
}

export default appConfig;
