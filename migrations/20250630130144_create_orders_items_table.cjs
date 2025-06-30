/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("order_items", table => {
      table.increments("id").primary();
      table.uuid("sku_id");
      table.decimal("mrp", 10, 2).unsigned();
      table.integer("qty").unsigned();
      table.integer("discount").unsigned();
      table.decimal("item_price", 10, 2).unsigned();
      table.integer("order_id").unsigned().notNullable();
      table.integer("product_id").unsigned();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.foreign("sku_id").references("sku_id")
          .inTable("product_variants").onDelete("SET NULL");
      table.foreign("order_id").references("id").inTable("orders").onDelete("CASCADE");
      table.foreign("product_id").references("id").inTable("products").onDelete("SET NULL");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("order_items");
};
