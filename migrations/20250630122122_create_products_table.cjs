/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("products", table=>{
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("image_url");
      table.string("short_info");
      table.string("description");
      table.decimal("mrp",10, 2).unsigned().notNullable();
      table.integer("discount").notNullable().defaultTo(0);
      table.jsonb("details");
      table.jsonb("specifications");
      table.boolean("is_featured").defaultTo(false);
      table.integer("category_id").unsigned();
      table.integer("sub_category_id").unsigned();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.foreign("category_id").references("id")
          .inTable("categories").onDelete("SET NULL");
      table.foreign("sub_category_id").references("id")
          .inTable("sub_categories").onDelete("SET NULL");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("products");
};
