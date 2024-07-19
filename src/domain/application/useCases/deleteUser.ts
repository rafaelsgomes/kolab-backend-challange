import { Injectable } from '@nestjs/common'
import { IUsersRepository } from '../repositories/IUsersRepository'

type DeleteUserUseCaseRequest = {
  userId: string
}

type DeleteUserUseCaseResponse = void

@Injectable()
export class DeleteUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    await this.usersRepository.delete(userId)
  }
}
