import { IUsersRepository } from '../repositories/IUsersRepository'
import { Injectable } from '@nestjs/common'
import { ParentTreeDetails } from '@/domain/entities/valueObjects/ParentTreeDetails'

type FetchParentTreeUseCaseRequest = {
  parentId: string
}

type FetchParentTreeUseCaseResponse = {
  parentTreeDetails: ParentTreeDetails
}

@Injectable()
export class FetchParentTreeUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({
    parentId,
  }: FetchParentTreeUseCaseRequest): Promise<FetchParentTreeUseCaseResponse> {
    const parentTreeDetails =
      await this.usersRepository.findManyByParentId(parentId)

    return {
      parentTreeDetails,
    }
  }
}
