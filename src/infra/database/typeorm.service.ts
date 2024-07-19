import { DataSource } from 'typeorm'
import { EnvService } from '../env/env.service'
import { User } from './typeOrm/entities/User.entity'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

@Injectable()
export class TypeormService
  extends DataSource
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private env: EnvService) {
    super({
      type: 'postgres',
      host: env.get('DB_HOST'),
      port: env.get('DB_PORT'),
      username: env.get('DB_USER'),
      password: env.get('DB_PASSWORD'),
      database: env.get('DB_DATABASE'),
      schema: env.get('DB_SCHEMA'),
      dropSchema: false,
      entities: [User],
      synchronize: false,
    })
  }

  async onModuleInit() {
    try {
      const dataSource = await this.initialize()
      console.log('Database connected successfully')
      if (this.env.get('NODE_ENV') === 'test') {
        const schema = randomUUID()
        const queryRunner = dataSource.createQueryRunner()
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`)
        await dataSource.destroy()
        dataSource.setOptions({
          schema,
          synchronize: true,
          dropSchema: true,
        })
        await dataSource.initialize()
      }
      return dataSource
    } catch (error) {}
  }

  onModuleDestroy() {
    return this.destroy()
  }
}
