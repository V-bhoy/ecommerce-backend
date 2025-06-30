/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("otp_verification", table =>{
      table.increments("id").primary();
      table.integer("customer_id").unsigned().notNullable();
      table.string("otp").notNullable();
      table.timestamp("expiry").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.foreign("customer_id").references("id").inTable("customers").onDelete("CASCADE");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("otp_verification");
};
