import { UserAlreadyExistsError } from '@/domain/application/_errors/userAlreadyExistsError'
import { UserParentNotFoundError } from '@/domain/application/_errors/userParentNotFoundError'
import { AuthenticateUserUseCase } from '@/domain/application/useCases/authenticateUser'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zodValidationPipe'

const authenticateUserBodySchema = z.object({
  userName: z.string().max(200),
  password: z.string().max(200),
})

type authenticateUserBody = z.infer<typeof authenticateUserBodySchema>

@Controller('/authenticate')
export class AuthenticateUserController {
  constructor(private useCase: AuthenticateUserUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  async handle(
    @Body() body: authenticateUserBody,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const { password, userName } = body

      const { token } = await this.useCase.execute({
        password,
        userName,
      })

      const expiresIn = new Date().getTime() + 604800000 // 7d in milliseconds

      res.cookie('access_token', token, {
        expires: new Date(expiresIn),
        httpOnly: true,
      })

      return {
        access_token: token,
        expiresIn: new Date(expiresIn),
      }
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
