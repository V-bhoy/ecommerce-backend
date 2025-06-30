const path = require("path");
const fs = require("fs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const filePath = path.resolve("./mock-data/product_variants.json");
  const raw = fs.readFileSync(filePath);
  const products = JSON.parse(raw);

  const cleaned = products.map(p => {
    const { created_at, updated_at, ...rest } = p;
    return {
      ...rest,
      id: +p.id,
      qty: +p.qty,
      product_id: +p.product_id,
    };
  });

  // Deletes ALL existing entries
  await knex('product_variants').del()
  await knex('product_variants').insert(cleaned);
};
