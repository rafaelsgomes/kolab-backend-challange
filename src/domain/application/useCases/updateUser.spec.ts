import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { UpdateUserUseCase } from './updateUser'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryHasher } from 'test/cryptography/InMemoryHasher'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'
import { UserNotFoundError } from '../_errors/userNotFoundError'

let repository: InMemoryUsersRepository
let hasher: InMemoryHasher
let sut: UpdateUserUseCase
describe('Updated user', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    hasher = new InMemoryHasher()
    sut = new UpdateUserUseCase(repository, hasher)
  })

  it('should be able to update a user', async () => {
    const userOnDatabase = makeUser({
      userName: 'johnDoe',
    })

    await repository.create(userOnDatabase)

    await sut.execute({
      userId: userOnDatabase.id,
      name: 'John Doe - updated',
      userName: 'johnDoe',
      password: 'password123',
    })

    expect(repository.items[0].name).toEqual('John Doe - updated')
    expect(repository.items[0].updatedAt).toEqual(expect.any(Date))
  })

  it('should not be able to update a user that not exists', async () => {
    expect(() => {
      return sut.execute({
        userId: 'userOnDatabase.id',
        name: 'John Doe - updated',
        userName: 'johnDoe2',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to update a userName to a existing userName', async () => {
    await repository.create(
      makeUser({
        userName: 'johnDoe2',
      }),
    )
    const userOnDatabase = makeUser({
      userName: 'johnDoe',
    })

    await repository.create(userOnDatabase)

    expect(() => {
      return sut.execute({
        userId: userOnDatabase.id,
        name: 'John Doe - updated',
        userName: 'johnDoe2',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
