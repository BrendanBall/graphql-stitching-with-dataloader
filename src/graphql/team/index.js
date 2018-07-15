import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema.gql'
import rootResolver, { teamUserIdsLoader } from './resolvers'

export const teamSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: rootResolver
})

export function teamLoaders (knex) {
  return {
    teamUserIds: teamUserIdsLoader(knex)
  }
}
