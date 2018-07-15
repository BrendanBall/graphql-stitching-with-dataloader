import Team from '../../models/team'
import TeamUser from '../../models/teamUser'
import DataLoader from 'dataloader'
import { print } from 'graphql'

export async function teams (obj, args, { knex }, info) {
  return Team.query(knex)
}

export async function teamById (obj, { id }, { knex }, info) {
  console.log('teamById for: ', id)
  return Team.query(knex).findById(id).throwIfNotFound()
}

export async function teamsByUserIds (obj, { userIds }, { knex }, info) {
  let teams = await Team.query(knex).findByIds(userIds).throwIfNotFound()
  return userIds.map(userId => teams.find(u => u.userId === userId))
}

export async function teamsByIds (obj, { ids }, { knex }, info) {
  console.log('in query: ', print(info.fieldNodes[0]).replace(/\s+/g, ' '), '-- ids:', ids)
  return Team.query(knex).findByIds(ids).throwIfNotFound()
}

export async function createTeam (obj, { input }, { knex }, info) {
  return Team.query(knex).insert(input)
}

export async function updateTeam (obj, { id, input }, { knex }, info) {
  return Team.query(knex).patchAndFetchById(id, input)
}

export const TeamResolver = {
  async userIds (team, args, { loaders: { teamUserIds } }, info) {
    return teamUserIds.load(team.id)
  }
}

export function teamUserIdsLoader (knex) {
  return new DataLoader(async teamIds => {
    let userIds = await TeamUser.query(knex).whereIn('teamId', teamIds)
    userIds = userIds.reduce((acc, curr) => {
      acc[curr.teamId] = [ ...(acc[curr.teamId] ? acc[curr.teamId] : []), curr.userId ]
      return acc
    }, {})
    return teamIds.map(teamId => userIds[teamId])
  })
}

export default {
  Query: {
    teams,
    teamById,
    teamsByIds
  },
  Mutation: {
    createTeam,
    updateTeam
  },
  Team: TeamResolver
}
