import { User } from '@/domain/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'
import { IHasher } from '../cryptography/IHasher'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'

type UpdateUserUseCaseRequest = {
  userId: string
  name: string
  userName: string
  password: string
  parentId?: string
}

type UpdateUserUseCaseResponse = {
  user: User
}

export class UpdateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    name,
    parentId,
    password,
    userId,
    userName,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    if (userName !== user.userName) {
      const userAlreadyExists =
        await this.usersRepository.findByUseName(userName)

      if (userAlreadyExists) {
        throw new UserAlreadyExistsError(userName)
      }
      user.userName = userName
    }

    user.name = name
    user.parentUserId = parentId
    user.password = await this.hasher.hash(password)

    await this.usersRepository.save(user)

    return {
      user,
    }
  }
}
