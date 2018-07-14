import Knex from 'knex'
import knexConfig from '../../knexfile'
import User from './user'
import { setupDB } from '../test-setup'

describe('ticket', async () => {
  const knex = Knex(knexConfig.testing)

  beforeAll(async () => setupDB(knex))

  test('create', async () => {
    await User.query(knex).insert({username: 'bob', name: 'Bob'})
    let users = await User.query(knex)
    expect(users).toEqual([{id: expect.anything(), username: 'bob', name: 'Bob'}])
  })
})
