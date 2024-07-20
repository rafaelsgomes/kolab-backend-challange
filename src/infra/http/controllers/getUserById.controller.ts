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
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
@Controller(':userId')
export class GetUserByIdController {
  constructor(private useCase: GetUserByIdUseCase) {}
  @Get()
  @ApiTags('Users')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiCookieAuth('access_token')
  @ApiParam({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        userName: { type: 'string', example: 'johnDoe' },
        password: { type: 'string', example: 'password123' },
        parentUserId: {
          type: 'string',
          example: '069697a5-93c0-4254-aeb1-49e15654e8f1',
        },
      },
    },
  })
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
