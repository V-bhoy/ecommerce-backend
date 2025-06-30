/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  //   await knex.schema.raw(`
  //   ALTER TABLE sub_categories
  //   DROP CONSTRAINT IF EXISTS sub_categories_name_unique
  // `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    // await knex.schema.alterTable("sub_categories", table => {
    //     table.unique("name");
    // });
};
