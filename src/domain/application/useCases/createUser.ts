import { User } from '@/domain/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { UserAlreadyExistsError } from '../_errors/userAlreadyExistsError'
import { UserParentNotFoundError } from '../_errors/userParentNotFoundError'
import { IHasher } from '../cryptography/IHasher'
import { Injectable } from '@nestjs/common'

type CreateUserUseCaseRequest = {
  name: string
  userName: string
  password: string
  parentUserId?: string
}

type CreateUserUseCaseResponse = {
  user: User
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
  ) {}

  async execute({
    name,
    userName,
    password,
    parentUserId,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userAlreadyExists = await this.usersRepository.findByUseName(userName)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError(userName)
    }

    if (parentUserId) {
      const parentUser = await this.usersRepository.findById(parentUserId)

      if (!parentUser) {
        throw new UserParentNotFoundError()
      }
    }

    const user = User.create({
      name,
      userName,
      parentUserId,
      password: await this.hasher.hash(password),
    })

    await this.usersRepository.create(user)

    return {
      user,
    }
  }
}
