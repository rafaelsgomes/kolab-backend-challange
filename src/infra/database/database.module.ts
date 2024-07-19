import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'
import { User } from './typeOrm/entities/User.entity'
import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { TypeormUsersRepository } from './typeOrm/repositories/typeormUsersRepository'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        return {
          type: 'postgres',
          host: env.get('DB_HOST'),
          port: env.get('DB_PORT'),
          username: env.get('DB_USER'),
          password: env.get('DB_PASSWORD'),
          database: env.get('DB_DATABASE'),
          schema: env.get('DB_SCHEMA'),
          dropSchema: env.get('NODE_ENV') === 'test',
          entities: [User],
          synchronize: env.get('DB_SYNCHRONIZE'),
        }
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    EnvService,
    {
      provide: IUsersRepository,
      useClass: TypeormUsersRepository,
    },
  ],
  exports: [IUsersRepository],
})
export class DatabaseModule {}
