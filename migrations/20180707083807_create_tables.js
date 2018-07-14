
exports.up = knex => {
  return knex.schema
    .createTable('user', table => {
      table.increments('id').primary()
      table.string('username')
      table.string('name')
    })
    .createTable('ticket', table => {
      table.increments('id').primary()
      table.string('title')
      table.string('description')
      table.date('createdAt')
      table.date('modifiedAt')
      table.integer('createdByUserId')
      table.integer('assignedToUserId')

      table.foreign('createdByUserId').references('id').inTable('user')
      table.foreign('assignedToUserId').references('id').inTable('user')
    })
    .createTable('ticketTag', table => {
      table.integer('ticketId')
      table.integer('tagId')

      table.foreign('ticketId').references('id').inTable('ticket')
    })
    .createTable('tag', table => {
      table.increments('id').primary()
      table.string('name').unique()
      table.string('description')
    })
}

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('ticket')
    .dropTableIfExists('user')
}
