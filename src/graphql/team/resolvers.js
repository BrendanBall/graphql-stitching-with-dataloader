import Team from '../../models/team'
import TeamUser from '../../models/teamUser'
import DataLoader from 'dataloader'
import { print } from 'graphql'

export async function teams (obj, args, { knex }, info) {
  let resp = await Team.query(knex)
  console.log('teams: ', resp)
  return resp
}

export async function teamById (obj, { id }, { knex }, info) {
  console.log('teamById for: ', id)
  return Team.query(knex).findById(id).throwIfNotFound()
}

export async function teamsByUserIds (obj, { userIds }, { knex }, info) {
  console.log('in query: ', print(info.fieldNodes[0]).replace(/\s+/g, ' '), '-- userIds:', userIds)
  let users = await TeamUser.query(knex).eager('team').whereIn('userId', userIds)
  let resp = userIds.map(userId => users.find(u => u.userId === userId).team)
  console.log('teamsByUserIds: ', resp)
  return resp
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
  async userIds (team, args, ctx, info) {
    console.log('loading team userIds for team: ', team.id)
    return ctx.loaders.teamUserIds.load(team.id)
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
    teamsByIds,
    teamsByUserIds
  },
  Mutation: {
    createTeam,
    updateTeam
  },
  Team: TeamResolver
}
