import User from '../../../models/user'
import DataLoader from 'dataloader'

export async function users (obj, args, { knex }, info) {
  return User.query(knex)
}

export async function createUser (obj, { input }, { knex }, info) {
  return User.query(knex).insert(input)
}

export async function updateUser (obj, { id, input }, { knex }, info) {
  return User.query(knex).patchAndFetchById(id, input)
}

export function userLoader (knex) {
  return new DataLoader(async ids => User.query(knex).whereIn('id', ids))
}
