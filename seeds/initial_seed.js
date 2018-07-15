
exports.seed = knex => {
  return knex('user').del()
    .then(() => knex('ticketTag').del())
    .then(() => knex('tag').del())
    .then(() => knex('ticket').del())
    .then(() => knex('user').insert([
      { username: 'bob', name: 'Bob' },
      { username: 'alice', name: 'Alice' },
      { username: 'john', name: 'John' }
    ]))
    .then(() => knex('tag').insert([
      { name: 'p1', description: 'high priority' },
      { name: 'p2', description: 'low priority' }
    ]))
    .then(() => knex('ticket').insert([
      { title: 'p1', description: 'high priority', createdByUserId: 1, assignedToUserId: 1, createdAt: new Date() },
      { title: 'p2', description: 'low priority', createdByUserId: 2, assignedToUserId: 1, createdAt: new Date() }
    ]))
    .then(() => knex('ticketTag').insert([
      { ticketId: 1, tagId: 1 },
      { ticketId: 1, tagId: 2 },
      { ticketId: 2, tagId: 2 }
    ]))
    .then(() => knex('team').insert([
      { name: 'all stars' },
      { name: 'bbb' }
    ]))
    .then(() => knex('teamUser').insert([
      { teamId: 1, userId: 1 },
      { teamId: 1, userId: 3 },
      { teamId: 2, userId: 2 }
    ]))
}
