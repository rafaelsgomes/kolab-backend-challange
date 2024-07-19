import { GetUserByIdUseCase } from '@/domain/application/useCases/getUserById'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserPresenter } from '../presenters/userPresenter'
import { UserNotFoundError } from '@/domain/application/_errors/userNotFoundError'

@Controller(':userId')
export class GetUserByIdController {
  constructor(private useCase: GetUserByIdUseCase) {}
  @Get()
  @HttpCode(200)
  async handle(@Param('userId') userId: string) {
    try {
      const { user } = await this.useCase.execute({
        userId,
      })

      return {
        user: UserPresenter.toHttp(user),
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
