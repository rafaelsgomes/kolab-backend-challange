import { Module } from '@nestjs/common'
import { BcryptHasher } from './BcryptHasher'
import { IHasher } from '@/domain/application/cryptography/IHasher'

@Module({
  imports: [BcryptHasher],
  providers: [
    {
      provide: IHasher,
      useClass: BcryptHasher,
    },
  ],
  exports: [IHasher],
})
export class cryptographyModule {}
