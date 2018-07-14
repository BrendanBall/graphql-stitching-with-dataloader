import { Model } from 'objection'
import Ticket from './ticket'

export default class Tag extends Model {
  static tableName = 'tag'
}