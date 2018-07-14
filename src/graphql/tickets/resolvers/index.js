import { tickets, createTicket, updateTicket, TicketResolver as Ticket } from './ticket'
import { users, createUser, updateUser } from './user'

export default {
  Query: {
    tickets,
    users
  },
  Mutation: {
    createTicket,
    updateTicket,
    createUser,
    updateUser
  },
  Ticket
}
