import { FetchParentTreeUseCase } from '@/domain/application/useCases/fetchParentTree'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/application/_errors/userNotFoundError'
import { ParentTreeDetailsPresenter } from '../presenters/parentTreeDetailsPresenter'

@Controller(':parentId/tree')
export class FetchParentTreeController {
  constructor(private useCase: FetchParentTreeUseCase) {}
  @Get()
  @HttpCode(200)
  async handle(@Param('parentId') parentId: string) {
    try {
      const { parentTreeDetails } = await this.useCase.execute({
        parentId,
      })

      return {
        parentTreeDetails: ParentTreeDetailsPresenter.toHttp(parentTreeDetails),
      }
    } catch (error) {
      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
