import { mergeSchemas } from 'graphql-tools'
import { ticketSchema, ticketLoaders } from './ticket'
import { tagSchema } from './tag'
import { userSchema, userLoaders } from './user'
import { Binding } from 'graphql-binding'
import DataLoader from 'dataloader'
import { print } from 'graphql'
import { print as printSelectionSet } from './printer'

const linkTypeDefs = `
  extend type Ticket {
    tags: [Tag!]!
    createdBy: User!
  }
`

const userBinding = new Binding({ schema: userSchema })

const userLoader = new DataLoader(async ids => {
  let resp = await userBinding.query.usersByIds({ ids: ids.map(obj => obj.id) }, printSelectionSet(ids[0].selectionSet))
  console.log('userBinding resp: ', resp)
  return resp
})

const ticketCreatedBy = {
  fragment: `... on Ticket { createdByUserId }`,
  resolve (ticket, args, context, info) {
    console.log('out query: ', print(info.fieldNodes[0]).replace(/\s+/g, ' '), '-- createdByUserId: ', ticket.createdByUserId)
    return userLoader.load({ id: ticket.createdByUserId, selectionSet: info.fieldNodes[0].selectionSet })
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
        createdBy: ticketCreatedBy
      }

    }
  })
}

export function createLoaders (knex) {
  return { ...ticketLoaders(knex), ...userLoaders(knex) }
}
