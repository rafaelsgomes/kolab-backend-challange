import { Module } from '@nestjs/common'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { TypeormUsersRepository } from './typeOrm/repositories/typeormUsersRepository'
import { TypeormService } from './typeorm.service'
import { EnvService } from '../env/env.service'

@Module({
  providers: [
    EnvService,
    TypeormService,
    {
      provide: IUsersRepository,
      useClass: TypeormUsersRepository,
    },
  ],
  exports: [IUsersRepository, TypeormService],
})
export class DatabaseModule {}
