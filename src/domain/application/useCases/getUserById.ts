import { User } from '@/domain/entities/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { UserNotFoundError } from '../_errors/userNotFoundError'

type GetUserByIdUseCaseRequest = {
  userId: string
}

type GetUserByIdUseCaseResponse = {
  user: User
}

export class GetUserByIdUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({
    userId,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    return {
      user,
    }
  }
}
