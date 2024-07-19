import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { User } from '@/infra/database/typeOrm/entities/User.entity'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Repository } from 'typeorm'

describe('Create User (E2E)', () => {
  let app: INestApplication
  let repository: Repository<User>
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    repository = appModule.get('UserRepository')
    app = appModule.createNestApplication()

    await app.init()
  })

  test('[POST] /users/register', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: 'John Doe',
        userName: 'johnDoe',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(201)
    const userOnDatabase = await repository.findOneBy({ userName: 'johnDoe' })

    expect(userOnDatabase).toBeTruthy()
  })
})
