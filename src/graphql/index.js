import { mergeSchemas } from 'graphql-tools'
import { ticketSchema, ticketLoaders } from './ticket'
import { tagSchema } from './tag'
import { userSchema, userLoaders } from './user'

const linkTypeDefs = `
  extend type Ticket {
    tags: [Tag!]!
    createdBy: User!
  }
`

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
        createdBy: {
          fragment: `... on Ticket { createdByUserId }`,
          resolve (ticket, args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: userSchema,
              operation: 'query',
              fieldName: 'userById',
              args: {
                id: ticket.createdByUserId
              },
              context,
              info
            })
          }
        }
      }

    }
  })
}

export function createLoaders (knex) {
  return { ...ticketLoaders(knex), ...userLoaders(knex) }
}
