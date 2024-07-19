import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './infra/env/env'
import { DatabaseModule } from './infra/database/database.module'
import { UsersHttpModule } from './infra/http/controllers/usersHttpModule'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './infra/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersHttpModule,
    RouterModule.register([
      {
        path: 'users',
        module: UsersHttpModule,
      },
    ]),
  ],
})
export class AppModule {}
