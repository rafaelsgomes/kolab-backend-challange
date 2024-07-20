import { DeleteUserUseCase } from '@/domain/application/useCases/deleteUser'
import { CurrentUser } from '@/infra/auth/currentUser.decorator'
import { userPayload } from '@/infra/auth/jwtStrategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
} from '@nestjs/common'
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Users')
@Controller()
export class DeleteUserController {
  constructor(private useCase: DeleteUserUseCase) {}
  @Delete()
  @ApiOperation({ summary: 'Delete logged user' })
  @ApiCookieAuth('access_token')
  @ApiResponse({ description: 'The user has been successfully deleted.' })
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
