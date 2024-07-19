import { CreateUserUseCase } from '@/domain/application/useCases/createUser'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateUseController } from './createUser.controller'
import { cryptographyModule } from '@/infra/cryptography/cryptography.module'
import { AuthenticateUserController } from './authenticateUser.controller'
import { AuthenticateUserUseCase } from '@/domain/application/useCases/authenticateUser'

@Module({
  imports: [DatabaseModule, cryptographyModule],
  controllers: [CreateUseController, AuthenticateUserController],
  providers: [CreateUserUseCase, AuthenticateUserUseCase],
})
export class UsersHttpModule {}
