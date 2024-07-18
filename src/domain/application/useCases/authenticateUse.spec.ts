import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { AuthenticateUserUseCase } from './authenticateUse'
import { makeUser } from 'test/factories/makeUser'
import { InMemoryHasher } from 'test/cryptography/InMemoryHasher'
import { InMemoryEncrypter } from 'test/cryptography/InMemoryEncrypter'
import { InvalidCredentialsError } from '../_errors/invalidCredentialsError'

let repository: InMemoryUsersRepository
let hasher: InMemoryHasher
let encrypter: InMemoryEncrypter
let sut: AuthenticateUserUseCase
describe('Authenticate user', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    hasher = new InMemoryHasher()
    encrypter = new InMemoryEncrypter()
    sut = new AuthenticateUserUseCase(repository, hasher, encrypter)
  })
  it('should be able to authenticate a user', async () => {
    const userOnDatabase = makeUser({
      userName: 'johnDoe',
      password: await hasher.hash('password123'),
    })

    await repository.create(userOnDatabase)

    const { token } = await sut.execute({
      userName: 'johnDoe',
      password: 'password123',
    })

    expect(token).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong userName', async () => {
    expect(() => {
      return sut.execute({
        userName: 'johnDoe',
        password: 'password123',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userOnDatabase = makeUser({
      userName: 'johnDoe',
      password: await hasher.hash('password123'),
    })

    await repository.create(userOnDatabase)
    expect(() => {
      return sut.execute({
        userName: 'johnDoe',
        password: 'password1234',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
