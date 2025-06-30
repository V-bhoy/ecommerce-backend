/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // return knex.schema.alterTable("products", table => {
    //     table.boolean("is_featured").defaultTo(false);
    // })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    // return knex.schema.alterTable('products', table => {
    //     table.dropColumn("is_featured");
    // });
};
