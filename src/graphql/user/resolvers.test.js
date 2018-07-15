describe('reorder ids', () => {
  test('success', () => {
    let users = [
      { id: 1, username: 'bob', name: 'Bob' },
      { id: 2, username: 'alice', name: 'Alice' },
      { id: 3, username: 'john', name: 'John' }
    ]
    let expectedUsers = [
      { id: 1, username: 'bob', name: 'Bob' },
      { id: 3, username: 'john', name: 'John' },
      { id: 2, username: 'alice', name: 'Alice' }
    ]
    let ids = [1, 3, 2]
    let result = ids.map(id => users.find(u => u.id === id))
    expect(result).toEqual(expectedUsers)
  })
})
