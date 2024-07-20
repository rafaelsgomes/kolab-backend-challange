import { UserAlreadyExistsError } from '@/domain/application/_errors/userAlreadyExistsError'
import { UserParentNotFoundError } from '@/domain/application/_errors/userParentNotFoundError'
import { CreateUserUseCase } from '@/domain/application/useCases/createUser'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zodValidationPipe'
import { Public } from '@/infra/auth/public'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

const createUserBodySchema = z.object({
  name: z.string().max(200),
  userName: z.string().max(200),
  password: z.string().max(200),
  parentUserId: z.string().uuid().optional(),
})

type createUserBody = z.infer<typeof createUserBodySchema>

@Public()
@Controller('/register')
export class CreateUserController {
  constructor(private useCase: CreateUserUseCase) {}
  @Post()
  @ApiTags('Users')
  @ApiOperation({ summary: 'Create a new User' })
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
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: createUserBody) {
    try {
      const { name, parentUserId, password, userName } = body

      await this.useCase.execute({
        name,
        password,
        userName,
        parentUserId,
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
