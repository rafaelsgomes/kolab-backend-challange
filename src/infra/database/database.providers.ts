import { randomUUID } from 'crypto'
import { DataSource } from 'typeorm'
import { User } from './typeOrm/entities/User.entity'
import { EnvService } from '../env/env.service'

export const databaseProviders = [
  {
    provide: DataSource,
    inject: [EnvService],
    useFactory: async (env: EnvService) => {
      try {
        const dataSource = new DataSource({
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
        await dataSource.initialize()
        if (env.get('NODE_ENV') === 'test') {
          const schema = randomUUID()
          const queryRunner = dataSource.createQueryRunner()
          await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`)
          dataSource.setOptions({
            schema,
            synchronize: true,
            dropSchema: true,
          })
        }
        console.log('Database connected successfully')
        return dataSource
      } catch (error) {
        console.log('Error connecting to database')
        throw error
      }
    },
  },
]
