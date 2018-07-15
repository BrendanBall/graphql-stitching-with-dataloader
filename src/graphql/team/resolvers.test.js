import Knex from 'knex'
import knexConfig from '../../../knexfile'
import Team from '../../models/team'
import TeamUser from '../../models/teamUser'
import { setupDB, clearDB } from '../../test-setup'

describe('team', async () => {
  const knex = Knex(knexConfig.testing)

  beforeAll(async () => setupDB(knex))

  beforeEach(async () => {
    await Team.query(knex).insertGraph([
      { id: 1,
        name: 'all stars',
        users: [
          {
            teamId: 1,
            userId: 1
          },
          {
            teamId: 1,
            userId: 2
          }
        ]
      },
      { id: 2,
        name: 'bbb',
        users: [
          {
            teamId: 2,
            userId: 3
          },
          {
            teamId: 1,
            userId: 4
          }
        ] }
    ])
  })

  afterEach(async () => {
    await clearDB(knex)
  })

  test('teamsByUserIds', async () => {
    let userIds = [3, 1, 4]
    let users = await TeamUser.query(knex).eager('team').whereIn('userId', userIds)
    let resp = userIds.map(userId => users.find(u => u.userId === userId).team)
    let expectedResp = [{ id: 2, name: 'bbb' }, { id: 1, name: 'all stars' }, { id: 2, name: 'bbb' }]
    expect(resp).toEqual(expectedResp)
  })
})
