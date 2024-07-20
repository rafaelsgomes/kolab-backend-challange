import { UserAlreadyExistsError } from '@/domain/application/_errors/userAlreadyExistsError'
import { UserParentNotFoundError } from '@/domain/application/_errors/userParentNotFoundError'
import { UpdateUserUseCase } from '@/domain/application/useCases/updateUser'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zodValidationPipe'
import { CurrentUser } from '@/infra/auth/currentUser.decorator'
import { userPayload } from '@/infra/auth/jwtStrategy'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

const updateUserBodySchema = z.object({
  name: z.string().max(200),
  userName: z.string().max(200),
  password: z.string().max(200),
  parentUserId: z.string().uuid().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(updateUserBodySchema)

type updateUserBody = z.infer<typeof updateUserBodySchema>

@Controller()
export class UpdatedUserController {
  constructor(private useCase: UpdateUserUseCase) {}
  @Put()
  @ApiTags('Users')
  @ApiOperation({ summary: 'Update the logged User' })
  @ApiBody({
    description: 'User data',
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
  @ApiResponse({
    description: 'The user has been successfully updated.',
  })
  @HttpCode(204)
  async handle(
    @CurrentUser() user: userPayload,
    @Body(bodyValidationPipe) body: updateUserBody,
  ) {
    try {
      const { name, parentUserId, password, userName } = body
      const { sub: userId } = user
      await this.useCase.execute({
        name,
        password,
        userName,
        parentId: parentUserId,
        userId,
      })
    } catch (error) {
      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        case UserParentNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
