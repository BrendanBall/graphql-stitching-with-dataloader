import { tickets, createTicket, updateTicket, TicketResolver as Ticket } from './ticket'

export default {
  Query: {
    tickets
  },
  Mutation: {
    createTicket,
    updateTicket
  },
  Ticket
}
