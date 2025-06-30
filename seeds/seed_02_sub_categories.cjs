/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('sub_categories').del()
  await knex('sub_categories').insert([
      { id: 1, name: "T-SHIRT", category_id: 1 },
      { id: 2, name: "FORMALS", category_id: 1 },
      { id: 3, name: "TROUSERS", category_id: 1 },
      { id: 4, name: "GYMWEAR", category_id: 1 },
      { id: 6, name: "T-SHIRT", category_id: 2 },
      { id: 7, name: "TOPS", category_id: 2 },
      { id: 8, name: "DRESS", category_id: 2 },
      { id: 9, name: "SAREES", category_id: 2 },
      { id: 10, name: "KURTA_SET", category_id: 2 },
      { id: 11, name: "GYMWEAR", category_id: 2 },
      { id: 12, name: "FROCKS", category_id: 3 },
      { id: 13, name: "CASUAL", category_id: 3 },
      { id: 14, name: "SHOES", category_id: 4 },
      { id: 15, name: "SANDAL", category_id: 4 },
      { id: 16, name: "HEELS", category_id: 4 },
      { id: 17, name: "WATCH", category_id: 5 },
      { id: 18, name: "BAGS", category_id: 5 },
      { id: 19, name: "WALLETS", category_id: 5 },
      { id: 20, name: "JEWELLERY_RING", category_id: 5 },
      { id: 21, name: "JEWELLERY_EARING", category_id: 5 },
      { id: 22, name: "JEWELLERY_NECKLACE", category_id: 5 },
      { id: 23, name: "JEWELLERY_BRACELET", category_id: 5 },
      { id: 24, name: "JEWELLERY_BANGLES", category_id: 5 },
      { id: 25, name: "JEWELLERY_ANKLET", category_id: 5 }
  ]);
};
