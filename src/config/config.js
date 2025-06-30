import "dotenv/config.js";

export const config = {
    development: {
        PORT: process.env.PORT || 3000,
        DB: {
            client: "pg",
            connection: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 5432,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
                // ssl: {
                //     rejectUnauthorized: false
                // },
            },
            migrations: {
                tableName: "knex_migrations",
                directory: "./migrations"
            },
            seeds: {
               directory: "./seeds"
            },
            pool: {
                min: 0,
                max: 2,
                idleTimeoutMillis: 3000
            },
        }
    },
    production: {
        PORT: process.env.PORT || 8080,
        DB: {
            client: "pg",
            connection: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 5432,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                // ssl: {
                //     rejectUnauthorized: false
                // }
            },
            migrations: {
                tableName: "knex_migrations",
                directory: "./migrations"
            },
            pool: {
                min: 0,
                max: 2,
                idleTimeoutMillis: 3000
            },
        }
    }
}