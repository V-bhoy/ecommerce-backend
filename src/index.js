import express from "express";
import "dotenv/config.js";
import cors from "cors";
import {createDB} from "./db/knex.js";
import transport from "./config/nodemailer.js";
import cookieParser from "cookie-parser";

const env = process.env.NODE_ENV || "development";
const db = createDB({env});
const app = express();
const nodemailer = {transport, senderEmail: process.env.SMTP_USER}

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const appConfig = {
    app,
    db,
    env,
    nodemailer
}

export default appConfig;
