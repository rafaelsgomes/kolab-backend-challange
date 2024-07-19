import { AuthenticateUserUseCase } from '@/domain/application/useCases/authenticateUser'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipe/zodValidationPipe'
import { InvalidCredentialsError } from '@/domain/application/_errors/invalidCredentialsError'
import { Public } from '@/infra/auth/public'

const authenticateUserBodySchema = z.object({
  userName: z.string().max(200),
  password: z.string().max(200),
})

type authenticateUserBody = z.infer<typeof authenticateUserBodySchema>

@Public()
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
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
