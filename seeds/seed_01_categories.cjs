/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex("categories").del()
  await knex("categories").insert([
      {id: 1, name: "MEN"},
    { id: 2, name: "WOMEN" },
    { id: 3, name: "KIDS" },
    { id: 4, name: "FOOTWEAR" },
    { id: 5, name: "ACCESSORIES" }
  ]);
};
