import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema'
import rootResolver from './resolvers'
import { ticketTagIdsLoader } from './resolvers/ticket'

export const ticketSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: rootResolver
})

export function ticketLoaders (knex) {
  return {
    ticketTagIds: ticketTagIdsLoader(knex)
  }
}
