import { Model } from 'objection'
import Team from './team'

export default class TeamUser extends Model {
  static tableName = 'teamUser'

  static get relationMappings () {
    return {
      team: {
        relation: Model.HasOneRelation,
        modelClass: Team,
        join: {
          from: 'teamUser.teamId',
          to: 'team.id'
        }
      }
    }
  }
}