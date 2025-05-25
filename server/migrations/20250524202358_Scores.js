/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('scores', table => {
    table.increments('scores_id').primary().unique()
    table.integer('user_id').unique()
    table.foreign('user_id').references('userId').inTable('accounts')
    table.integer('distance')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('scores', table => {
    table.dropForeign('user_id')
  })
  .then(() => {
    return knex.schema.dropTableIfExists('scores');
  })
};
