import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema.gql'
import rootResolver from './resolvers'
import DataLoader from 'dataloader'
import User from '../../models/user'

export const userSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: rootResolver
})

export function userLoader (knex) {
  return new DataLoader(async ids => User.query(knex).whereIn('id', ids))
}

export function userLoaders (knex) {
  return {
    users: userLoader(knex)
  }
}
