import { InMemoryUsersRepository } from "test/repositories/inMemoryUsersRepository"
import { CreateUserUseCase } from "./createUser"
import { makeUser } from "test/factories/makeUser"
import { UserAlreadyExistsError } from "../_errors/userAlreadyExistsError"
import { InMemoryHasher } from "test/cryptography/InMemoryHasher"
import { randomUUID } from "crypto"
import { UserParentNotFoundError } from "../_errors/userParentNotFoundError"

let repository: InMemoryUsersRepository
let hasher: InMemoryHasher
let sut: CreateUserUseCase
describe('Create user', ()=> {
  beforeEach(()=> {
    repository = new InMemoryUsersRepository()
    hasher = new InMemoryHasher()
    sut = new CreateUserUseCase(repository, hasher)
  })
  it("should be able to create a new user", async () => {
    await sut.execute({
      name: 'John Doe',
      userName: 'johnDoe',
      password: 'password123'
    })

    expect(repository.items.length).toEqual(1)
  })

  it("should be able to hash password upon registration", async () => {
    await sut.execute({
      name: 'John Doe',
      userName: 'johnDoe',
      password: 'password123'
    })

    expect(repository.items[0].password).toEqual('password123-hashed')
  })

  it("should not be able to create a new user with same userName", async () => {
    const userOnDatabase = makeUser({
      userName: 'johnDoe'
    })

    await repository.create(userOnDatabase)

    expect(() => {
      return sut.execute({
        name: 'John Doe',
        userName: 'johnDoe',
        password: 'password123'
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it("should not be able to create a new user with parent if the parent does not exists", async () => {
    expect(() => {
      return sut.execute({
        name: 'John Doe',
        userName: 'johnDoe',
        password: 'password123',
        parentUserId: randomUUID()
      })
    }).rejects.toBeInstanceOf(UserParentNotFoundError)
  })
})