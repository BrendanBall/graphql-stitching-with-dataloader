import User from '../../models/user'
import { print } from 'graphql'

export async function users (obj, args, { knex }, info) {
  return User.query(knex)
}

export async function userById (obj, { id }, { knex }, info) {
  console.log('userById for: ', id)
  return User.query(knex).findById(id).throwIfNotFound()
}

export async function usersByIds (obj, { ids }, { knex }, info) {
  console.log('in query: ', print(info.fieldNodes[0]).replace(/\s+/g, ' '), '-- ids:', ids)
  return User.query(knex).findByIds(ids).throwIfNotFound()
}

export async function createUser (obj, { input }, { knex }, info) {
  return User.query(knex).insert(input)
}

export async function updateUser (obj, { id, input }, { knex }, info) {
  return User.query(knex).patchAndFetchById(id, input)
}

export default {
  Query: {
    users,
    userById,
    usersByIds
  },
  Mutation: {
    createUser,
    updateUser
  }
}
