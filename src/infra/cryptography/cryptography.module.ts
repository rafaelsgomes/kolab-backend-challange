import { Module } from '@nestjs/common'
import { BcryptHasher } from './BcryptHasher'
import { IHasher } from '@/domain/application/cryptography/IHasher'
import { IEncrypter } from '@/domain/application/cryptography/IEncrypter'
import { JwtEncrypter } from './jwtEncrypter'
import { EnvService } from '../env/env.service'

@Module({
  providers: [
    EnvService,
    {
      provide: IHasher,
      useClass: BcryptHasher,
    },
    {
      provide: IEncrypter,
      useClass: JwtEncrypter,
    },
  ],
  exports: [IHasher, IEncrypter],
})
export class cryptographyModule {}
