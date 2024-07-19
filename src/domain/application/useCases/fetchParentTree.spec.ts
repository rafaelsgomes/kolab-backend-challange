import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { FetchParentTreeUseCase } from './fetchParentTree'
import { makeUser } from 'test/factories/makeUser'

let repository: InMemoryUsersRepository
let sut: FetchParentTreeUseCase
describe('Fetch parent tree by parent id', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()

    sut = new FetchParentTreeUseCase(repository)
  })
  it('should be able to fetch parent tree by parent id', async () => {
    const parent = makeUser()
    const user01OnDatabase = makeUser({ parentUserId: parent.id })
    const user02OnDatabase = makeUser({ parentUserId: parent.id })
    const user03OnDatabase = makeUser({ parentUserId: parent.id })

    await Promise.all([
      repository.create(parent),
      repository.create(user01OnDatabase),
      repository.create(user02OnDatabase),
      repository.create(user03OnDatabase),
    ])

    const { parentTreeDetails } = await sut.execute({ parentId: parent.id })

    expect(parentTreeDetails.users.length).toEqual(3)
  })
})
