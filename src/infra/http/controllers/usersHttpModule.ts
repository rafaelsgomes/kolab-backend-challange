import { CreateUserUseCase } from '@/domain/application/useCases/createUser'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateUseController } from './createUser.controller'
import { cryptographyModule } from '@/infra/cryptography/cryptography.module'
import { AuthenticateUserController } from './authenticateUser.controller'
import { AuthenticateUserUseCase } from '@/domain/application/useCases/authenticateUser'
import { GetUserByIdUseCase } from '@/domain/application/useCases/getUserById'
import { GetUserByIdController } from './getUserById.controller'
import { DeleteUserController } from './deleteUser.controller'
import { DeleteUserUseCase } from '@/domain/application/useCases/deleteUser'

@Module({
  imports: [DatabaseModule, cryptographyModule],
  controllers: [
    CreateUseController,
    AuthenticateUserController,
    GetUserByIdController,
    DeleteUserController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    DeleteUserUseCase,
  ],
})
export class UsersHttpModule {}
