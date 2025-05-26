/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex.schema.raw('TRUNCATE TABLE scores_crayons');
  await knex.schema.raw('TRUNCATE TABLE accounts CASCADE');
  await knex.schema.raw('TRUNCATE TABLE crayons CASCADE')
  await knex('crayons').insert([
    {crayonsID: 1, color: 'green'},
    {crayonsID: 2, color: 'blue'},
    {crayonsID: 3, color: 'red'},
    {crayonsID: 4, color: 'orange'}
  ]);
};
