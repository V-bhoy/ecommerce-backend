/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("orders", table => {
      table.increments("id").primary();
      table.integer("customer_id").unsigned();
      table.string("razorpay_order_id").unique().notNullable();
      table.string("payment_id").unique();
      table.string("status");
      table.decimal("total_amount", 10, 2).unsigned().defaultTo(0);
      table.decimal("discount", 10, 2).unsigned().defaultTo(0);
      table.decimal("shipping_charges", 10, 2).unsigned().defaultTo(0);
      table.decimal("delivery_charges", 10, 2).unsigned().defaultTo(0);
      table.decimal("gst", 10, 2).unsigned().defaultTo(20);
      table.decimal("final_amount", 10, 2).unsigned().defaultTo(0);
      table.jsonb("billing_details").notNullable();
      table.timestamp("paid_at");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.foreign("customer_id")
          .references("id")
          .inTable("customers").onDelete("SET NULL");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("orders");
};
