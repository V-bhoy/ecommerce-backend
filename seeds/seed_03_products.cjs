const path = require("path");
const fs = require("fs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const filePath = path.resolve('./mock-data/products.json');
  const raw = fs.readFileSync(filePath);
  const products = JSON.parse(raw);

  const cleaned = products.map(p => {
    const { created_at, updated_at, sales_count, ...rest } = p;
    return {
      ...rest,
      id: +p.id,
      mrp: parseFloat(p.mrp),
      discount: parseFloat(p.discount),
      is_featured: p.is_featured === true || p.is_featured === "true"
    };
  });

  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert(cleaned);
};
