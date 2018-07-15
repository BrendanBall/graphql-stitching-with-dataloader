import { mergeSchemas } from 'graphql-tools'
import { ticketSchema, ticketLoaders } from './ticket'
import { tagSchema } from './tag'
import { userSchema } from './user'
import { teamSchema, teamLoaders } from './team'
import { Binding } from 'graphql-binding'
import { print as printSelectionSet } from './printer'
import SmartDataLoader from './smartDataLoader'

const linkTypeDefs = `
  extend type Ticket {
    tags: [Tag!]!
    createdBy: User!
    assignedTo: User
  }

  extend type Team {
    users: [User!]
  }

  extend type User {
    team: Team
  }
`

const userBinding = new Binding({ schema: userSchema })
const teamBinding = new Binding({ schema: teamSchema })

function userLoader () {
  return new SmartDataLoader(async (ids, info) => {
    console.log('user loader : ', printSelectionSet(info.fieldNodes[0].selectionSet), '-- ids: ', ids)
    let resp = await userBinding.query.usersByIds({ ids }, info)
    console.log('userBinding resp: ', resp)
    return resp
  })
}

function teamByUserIdLoader () {
  return new SmartDataLoader(async (userIds, info) => {
    console.log('teamByUserId loader : ', printSelectionSet(info.fieldNodes[0].selectionSet), '-- userIds: ', userIds)
    let resp = await teamBinding.query.teamsByUserIds({ userIds }, info)
    console.log('teamBinding resp: ', JSON.stringify(resp))
    return resp
  })
}

const ticketCreatedBy = {
  fragment: `... on Ticket { createdByUserId }`,
  async resolve (ticket, args, { loaders: { user } }, info) {
    return user.load(ticket.createdByUserId, info)
  }
}

const ticketAssignedTo = {
  fragment: `... on Ticket { assignedToUserId }`,
  async resolve (ticket, args, { loaders: { user } }, info) {
    return user.load(ticket.assignedToUserId, info)
  }
}

const team = {
  users: {
    fragment: `... on Team { userIds }`,
    async resolve (team, args, { loaders: { user } }, info) {
      return user.loadMany(team.userIds, info)
    }
  }
}

const user = {
  team: {
    fragment: `... on User { id }`,
    async resolve (user, args, { loaders: { teamByUserId } }, info) {
      return teamByUserId.load(user.id, info)
    }
  }
}

export function createSchema () {
  return mergeSchemas({
    schemas: [ticketSchema, tagSchema, userSchema, teamSchema, linkTypeDefs],
    resolvers: {
      Ticket: {
        tags: {
          fragment: `... on Ticket { tagIds }`,
          resolve (ticket, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: tagSchema,
              operation: 'query',
              fieldName: 'tagsByIds',
              args: {
                ids: ticket.tagIds
              },
              context,
              info
            })
          }
        },
        createdBy: ticketCreatedBy,
        assignedTo: ticketAssignedTo
      },
      Team: team,
      User: user
    }
  })
}

export function createLoaders (knex) {
  return { ...ticketLoaders(knex), ...teamLoaders(knex), user: userLoader(), teamByUserId: teamByUserIdLoader() }
}
