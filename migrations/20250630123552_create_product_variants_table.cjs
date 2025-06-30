/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("product_variants", table => {
      table.increments("id").primary();
      table.uuid("sku_id").unique().defaultTo(knex.fn.uuid());
      table.string("size");
      table.integer("qty").unsigned().defaultTo(0);
      table.integer("product_id").unsigned().notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.foreign("product_id").references("id")
          .inTable("products").onDelete("CASCADE");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("product_variants");
};
