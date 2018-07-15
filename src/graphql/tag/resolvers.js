import Tag from '../../models/tag'

export async function tags (obj, args, { knex }, info) {
  return Tag.query(knex)
}

export async function tagById (obj, { id }, { knex }, info) {
  return Tag.query(knex).findById(id).throwIfNotFound()
}

export async function tagsByIds (obj, { ids }, { knex }, info) {
  let tags = await Tag.query(knex).findByIds(ids).throwIfNotFound()
  return ids.map(id => tags.find(u => u.id === id))
}

export async function createTag (obj, { input }, { knex }, info) {
  return Tag.query(knex).insert(input)
}

export async function updateTag (obj, { id, input }, { knex }, info) {
  return Tag.query(knex).patchAndFetchById(id, input)
}

export default {
  Query: {
    tags,
    tagById,
    tagsByIds
  },
  Mutation: {
    createTag,
    updateTag
  }
}
