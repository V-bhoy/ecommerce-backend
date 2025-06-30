import {config} from "./src/config/config.js";

export default {
    development: config.development.DB,
    production: config.production.DB
}