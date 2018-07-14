import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema'
import rootResolver from './resolvers'
import { ticketTagIdsLoader } from './resolvers/ticket'
import { userLoader } from './resolvers/user'

export function ticketSchema () {
  return makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: rootResolver
  })
}

export function ticketLoaders (knex) {
  return {
    users: userLoader(knex),
    ticketTagIds: ticketTagIdsLoader(knex)
  }
}
