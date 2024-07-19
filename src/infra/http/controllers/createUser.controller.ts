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

const createUserBodySchema = z.object({
  name: z.string().max(200),
  userName: z.string().max(200),
  password: z.string().max(200),
  parentUserId: z.string().uuid().optional(),
})

type createUserBody = z.infer<typeof createUserBodySchema>

@Controller('/register')
export class CreateUseController {
  constructor(private useCase: CreateUserUseCase) {}
  @Post()
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
