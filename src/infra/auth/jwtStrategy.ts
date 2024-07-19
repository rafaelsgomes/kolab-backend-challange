import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from '../env/env.service'
import { z } from 'zod'
import { Request } from 'express'

const userPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type userPayload = z.infer<typeof userPayloadSchema>

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
    if (!request.headers.cookie) {
      return null
    }
    const cookies = request.headers.cookie
      .split(';')
      .map((cookie) => cookie.trim())
      .reduce(
        (cookies, cookie) => {
          const [name, ...rest] = cookie.split('=')
          const value = rest.join('=')
          cookies[name] = decodeURIComponent(value)
          return cookies
        },
        {} as { [key: string]: string },
      )

    return 'access_token' in cookies && cookies.access_token.length > 0
      ? cookies.access_token
      : null
  }

  async validate(payload: userPayload) {
    return userPayloadSchema.parse(payload)
  }
}
