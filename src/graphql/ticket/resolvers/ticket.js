import Ticket from '../../../models/ticket'
import TicketTag from '../../../models/ticketTag'
import DataLoader from 'dataloader'

export async function tickets (obj, args, { knex }, info) {
  return Ticket.query(knex)
}

export async function createTicket (obj, { input }, { knex }, info) {
  return Ticket.query(knex).insertGraph(input, { relate: true })
}

export async function updateTicket (obj, { id, input }, { knex }, info) {
  return Ticket.query(knex).patchAndFetchById(id, input)
}

export const TicketResolver = {
  async tagIds (ticket, args, { loaders: { ticketTagIds } }, info) {
    return ticketTagIds.load(ticket.id)
  }
}

export function ticketTagIdsLoader (knex) {
  return new DataLoader(async ids => {
    let tagIds = await TicketTag.query(knex).whereIn('ticketId', ids)
    tagIds = tagIds.reduce((acc, curr) => {
      acc[curr.ticketId] = [ ...(acc[curr.ticketId] ? acc[curr.ticketId] : []), curr.tagId ]
      return acc
    }, {})
    return ids.map(ticketId => tagIds[ticketId])
  })
}
