import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { InvalidCredentialsError } from '@/domain/application/_errors/invalidCredentialsError'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('/logout')
export class LogoutUserController {
  @Delete()
  @ApiTags('Users')
  @ApiOperation({ summary: 'Logout user' })
  @ApiCookieAuth('access_token')
  @HttpCode(204)
  async handle(@Res({ passthrough: true }) res) {
    try {
      res.cookie('access_token', undefined, {
        expires: new Date(Date.now()),
      })
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
