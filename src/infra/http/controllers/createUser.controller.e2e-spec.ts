import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeormService } from '@/infra/database/typeorm.service'
import { User } from '@/infra/database/typeOrm/entities/User.entity'

describe('Create User (E2E)', () => {
  let app: INestApplication
  let typeormService: TypeormService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = appModule.createNestApplication()
    typeormService = appModule.get(TypeormService)

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
    const userOnDatabase = await typeormService
      .getRepository(User)
      .findOneBy({ userName: 'johnDoe' })

    expect(userOnDatabase).toBeTruthy()
  })
})
