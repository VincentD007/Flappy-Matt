/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('scores_crayons', table => {
    table.increments('scores_crayons_id').primary().unique()
    table.integer('score_id')
    table.foreign('score_id').references('scores_id').inTable('scores')
    table.integer('crayon_id')
    table.foreign('crayon_id').references('crayonsID').inTable('crayons')
    table.integer('amount')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('scores_crayons', table => {
    table.dropForeign('score_id')
    table.dropForeign('crayon_id')
  })
  .then(() => knex.schema.dropTableIfExists('scores_crayons'))
};
