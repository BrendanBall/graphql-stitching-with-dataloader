import { mergeSchemas } from 'graphql-tools'
import { ticketSchema, ticketLoaders } from './ticket'
import { tagSchema } from './tag'
import { userSchema } from './user'
import { Binding } from 'graphql-binding'
import DataLoader from 'dataloader'
import { print as printSelectionSet } from './printer'

const linkTypeDefs = `
  extend type Ticket {
    tags: [Tag!]!
    createdBy: User!
    assignedTo: User
  }
`

const userBinding = new Binding({ schema: userSchema })

class FancyDataLoader {
  constructor (batchLoadFn) {
    this.batchLoadFn = batchLoadFn
    this.loaders = {}
  }

  async load (id, selectionSet) {
    if (!id) {
      return null
    }
    let hash = printSelectionSet(selectionSet)
    let loader = this.loaders[hash]
    if (!loader) {
      this.loaders[hash] = new DataLoader(ids => this.batchLoadFn(ids, selectionSet))
    }
    return this.loaders[hash].load(id)
  }
}

function userLoader () {
  return new FancyDataLoader(async (ids, selectionSet) => {
    console.log('user loader : ', printSelectionSet(selectionSet), '-- ids: ', ids)
    let resp = await userBinding.query.usersByIds({ ids }, printSelectionSet(selectionSet))
    console.log('userBinding resp: ', resp)
    return resp
  })
}

const ticketCreatedBy = {
  fragment: `... on Ticket { createdByUserId }`,
  async resolve (ticket, args, { loaders: { user } }, info) {
    return user.load(ticket.createdByUserId, info.fieldNodes[0].selectionSet)
  }
}

const ticketAssignedTo = {
  fragment: `... on Ticket { assignedToUserId }`,
  async resolve (ticket, args, { loaders: { user } }, info) {
    return user.load(ticket.createdByUserId, info.fieldNodes[0].selectionSet)
  }
}

export function createSchema () {
  return mergeSchemas({
    schemas: [ticketSchema, tagSchema, userSchema, linkTypeDefs],
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
      }

    }
  })
}

export function createLoaders (knex) {
  return { ...ticketLoaders(knex), user: userLoader() }
}
