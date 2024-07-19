import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwtStrategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwtAuth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory(env: EnvService) {
        return {
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '7d',
          },
          privateKey: Buffer.from(env.get('PRIVATE_KEY'), 'base64'),
          publicKey: Buffer.from(env.get('PUBLIC_KEY'), 'base64'),
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
