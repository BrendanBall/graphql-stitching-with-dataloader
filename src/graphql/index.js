import { mergeSchemas } from 'graphql-tools'
import { ticketSchema, ticketLoaders } from './tickets'
import tagSchema from './tags'

export function createSchema () {
  return mergeSchemas({
    schemas: [ticketSchema(), tagSchema()]
  })
}

export function createLoaders (knex) {
  return { ...ticketLoaders(knex) }
}
