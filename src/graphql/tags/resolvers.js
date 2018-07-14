import Tag from '../../models/tag'

export async function tags (obj, args, { knex }, info) {
  return Tag.query(knex)
}

export async function createTag (obj, { input }, { knex }, info) {
  return Tag.query(knex).insert(input)
}

export async function updateTag (obj, { id, input }, { knex }, info) {
  return Tag.query(knex).patchAndFetchById(id, input)
}

export default {
  Query: {
    tags
  },
  Mutation: {
    createTag,
    updateTag
  }
}
