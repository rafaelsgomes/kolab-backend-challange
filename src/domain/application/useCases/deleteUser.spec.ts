import { InMemoryUsersRepository } from 'test/repositories/inMemoryUsersRepository'
import { DeleteUserUseCase } from './deleteUser'
import { makeUser } from 'test/factories/makeUser'

let repository: InMemoryUsersRepository
let sut: DeleteUserUseCase
describe('Delete user by id', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()

    sut = new DeleteUserUseCase(repository)
  })
  it('should be able to delete a user by id', async () => {
    const userOnDatabase = makeUser()

    await repository.create(userOnDatabase)

    await sut.execute({
      userId: userOnDatabase.id,
    })

    expect(repository.items.length).toEqual(0)
  })
})
