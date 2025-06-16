import knex from "knex";
import {config} from "../config.js";

export function createDB(args){
    return knex(config[args.env].DB);
}