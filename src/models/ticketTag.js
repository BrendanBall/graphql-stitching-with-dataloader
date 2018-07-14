import { Model } from 'objection'
import User from './user'
import Tag from './tag'

export default class TicketTag extends Model {
  static tableName = 'ticketTag'
}