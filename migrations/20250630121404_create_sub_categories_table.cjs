/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("sub_categories",table=>{
        table.increments("id").primary();
        table.string("name").notNullable();
        table.integer("category_id").unsigned().notNullable();
        table.foreign("category_id")
            .references("id").inTable("categories").onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("sub_categories");
};
