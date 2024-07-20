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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

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
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiTags('Users')
  @ApiBody({
    description: 'User credentials',
    schema: {
      type: 'object',
      properties: {
        userName: { type: 'string', example: 'johnDoe' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwOTc0YzBmYy00Y2JjLTRkYjEtYWYwNy1jMmI2NDgzNTNiOTUiLCJpYXQiOjE3MjE0MDc0NTUsImV4cCI6MTcyMjAxMjI1NX0.tiM120g-xrrMEXDkriuOFeZwvQDwM6bY1_6w7g6g6YUu8wc4P3-8d8-mrLC_PjN8G65aVCs9DM9OtNisC4vuuPA4aZEhalZtXagfuZCARLbnvqF_Y21nh2fSmw4uI9ubqt7SrMOtioTvjC2NkntIeZla4vQZqZrW3UJW7BABEk6VVmExJVTopMgLs6AdEymr8SRvt7NXrqMPxdAjbKc8rIptTr-_f3q6TPxB8NrGj6IixB21vOqBZHfCK0crZFtStWn4rvgGTEL2_fAlEfhA9aSSEZKrXsHcq96B6ExdMjX0E79NP5_0XlSESOpNiU5LA52OAPTJu6jTf8brkQWVuQ',
        },
        expiresIn: { type: 'Date', example: '2024-07-26T16:44:15.121Z' },
      },
    },
  })
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
