import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { FetchParentTreeByUserIdUseCase } from './fetchParentTreeByUserId'
import { makeUser } from 'test/factories/makeUser'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { randomUUID } from 'node:crypto'

let repository: InMemoryUsersRepository
let sut: FetchParentTreeByUserIdUseCase
describe('Fetch parent tree by user id', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()

    sut = new FetchParentTreeByUserIdUseCase(repository)
  })
  it('should be able to fetch parent tree by user id', async () => {
    const parentUserId = randomUUID()
    const user01OnDatabase = makeUser({ parentUserId })
    const user02OnDatabase = makeUser({ parentUserId })
    const user03OnDatabase = makeUser({ parentUserId })

    await Promise.all([
      repository.create(user01OnDatabase),
      repository.create(user02OnDatabase),
      repository.create(user03OnDatabase),
    ])

    const { users } = await sut.execute({
      userId: user01OnDatabase.id,
    })

    expect(users.length).toEqual(3)
  })

  it('should not be able to fetch parent tree by user id', async () => {
    expect(() => {
      return sut.execute({
        userId: 'userOnDatabase.id',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
