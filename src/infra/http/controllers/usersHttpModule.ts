import { CreateUserUseCase } from '@/domain/application/useCases/createUser'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateUseController } from './createUser.controller'
import { cryptographyModule } from '@/infra/cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, cryptographyModule],
  controllers: [CreateUseController],
  providers: [CreateUserUseCase],
})
export class UsersHttpModule {}
