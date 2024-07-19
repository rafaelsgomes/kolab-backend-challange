import { CreateUserUseCase } from '@/domain/application/useCases/createUser'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CreateUserController } from './createUser.controller'
import { cryptographyModule } from '@/infra/cryptography/cryptography.module'
import { AuthenticateUserController } from './authenticateUser.controller'
import { AuthenticateUserUseCase } from '@/domain/application/useCases/authenticateUser'
import { GetUserByIdUseCase } from '@/domain/application/useCases/getUserById'
import { GetUserByIdController } from './getUserById.controller'
import { DeleteUserController } from './deleteUser.controller'
import { DeleteUserUseCase } from '@/domain/application/useCases/deleteUser'
import { UpdatedUserController } from './updateUser.controller'
import { UpdateUserUseCase } from '@/domain/application/useCases/updateUser'

@Module({
  imports: [DatabaseModule, cryptographyModule],
  controllers: [
    CreateUserController,
    AuthenticateUserController,
    GetUserByIdController,
    DeleteUserController,
    UpdatedUserController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
  ],
})
export class UsersHttpModule {}
