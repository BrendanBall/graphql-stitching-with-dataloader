import { Model } from 'objection'
import TeamUser from './teamUser'

export default class Team extends Model {
  static tableName = 'team'

  static relationMappings = {
    users: {
      relation: Model.HasManyRelation,
      modelClass: TeamUser,
      join: {
        from: 'team.id',
        to: 'teamUser.teamId'
      }
    }
  }
}