import { DeleteUserUseCase } from '@/domain/application/useCases/deleteUser'
import { CurrentUser } from '@/infra/auth/currentUser.decorator'
import { userPayload } from '@/infra/auth/jwtStrategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'

@Controller()
export class DeleteUserController {
  constructor(private useCase: DeleteUserUseCase) {}
  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: userPayload) {
    const { sub: userId } = user
    try {
      await this.useCase.execute({
        userId,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
