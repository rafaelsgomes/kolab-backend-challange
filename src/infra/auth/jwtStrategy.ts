import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from '../env/env.service'
import { z } from 'zod'
import { Request } from 'express'

const userPayloadSchema = z.object({
  sub: z.string().uuid(),
})

type userPayload = z.infer<typeof userPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private env: EnvService) {
    const publicKey = env.get('PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  private static extractJwtFromCookies(request: Request): string | null {
    return request.cookies &&
      'access_token' in request.cookies &&
      request.cookies.access_token.length > 0
      ? request.cookies.access_token
      : null
  }

  async validate(payload: userPayload) {
    return userPayloadSchema.parse(payload)
  }
}
