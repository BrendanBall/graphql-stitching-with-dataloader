import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema.gql'
import rootResolver from './resolvers'

export const tagSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: rootResolver
})
