import { Tag, Team, TeamUser, Ticket, TicketTag, User } from './models'

export async function setupDB (knex) {
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
    .createTable('team', table => {
      table.increments('id').primary()
      table.string('name')
    })
    .createTable('teamUser', table => {
      table.integer('teamId')
      table.integer('userId').unique()

      table.foreign('teamId').references('id').inTable('team')
    })
}

export async function clearDB (knex) {
  await Tag.query(knex).delete()
  await TeamUser.query(knex).delete()
  await Team.query(knex).delete()
  await TicketTag.query(knex).delete()
  await Ticket.query(knex).delete()
  await User.query(knex).delete()
}
