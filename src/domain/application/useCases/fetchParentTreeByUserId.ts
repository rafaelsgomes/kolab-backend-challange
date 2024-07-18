import { User } from '@/domain/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

type FetchParentTreeByUserIdUseCaseRequest = {
  userId: string
}

type FetchParentTreeByUserIdUseCaseResponse = {
  users: User[]
}

export class FetchParentTreeByUserIdUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({
    userId,
  }: FetchParentTreeByUserIdUseCaseRequest): Promise<FetchParentTreeByUserIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const users = await this.usersRepository.findManyByParentId(
      user.parentUserId,
    )

    return {
      users,
    }
  }
}
