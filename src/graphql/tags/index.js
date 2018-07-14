import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema.gql'
import rootResolver from './resolvers'

export default function tagSchema () {
  return makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: rootResolver
  })
}
