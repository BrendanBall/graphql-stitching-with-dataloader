import { Model } from 'objection'
import User from './user'
import Tag from './tag'

export default class Ticket extends Model {
  static tableName = 'ticket'

  static relationMappings = {
    createdBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'ticket.createdByUserId',
        to: 'user.id'
      }
    },
    assignedTo: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'ticket.assignedToUserId',
        to: 'user.id'
      }
    }
  }
}