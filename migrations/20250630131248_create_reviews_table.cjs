/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("reviews", table => {
      table.increments("id").primary();
      table.string("review");
      table.integer("rating").unsigned();
      table.integer("fit").unsigned();
      table.integer("length").unsigned();
      table.integer("transparency").unsigned();
      table.integer("customer_id").unsigned().notNullable();
      table.integer("product_id").unsigned().notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.foreign("customer_id").references("id").inTable("customers").onDelete("CASCADE");
      table.foreign("product_id").references("id").inTable("products").onDelete("CASCADE");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("reviews");
};
