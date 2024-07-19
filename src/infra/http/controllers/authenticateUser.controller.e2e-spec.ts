import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/makeUser'
import { hash } from 'bcryptjs'

describe('Authenticate User (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    userFactory = appModule.get(UserFactory)
    app = appModule.createNestApplication()

    await app.init()
  })

  test('[POST] /users/authenticate', async () => {
    await userFactory.makeTypeormUser({
      name: 'John Doe',
      userName: 'johnDoe',
      password: await hash('password123', 8),
    })

    const response = await request(app.getHttpServer())
      .post('/users/authenticate')
      .send({
        userName: 'johnDoe',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.access_token).toEqual(expect.any(String))
    expect(response.body.expiresIn).toEqual(expect.any(String))
    expect(
      response.headers['set-cookie'][0].includes('access_token'),
    ).toBeTruthy()
  })
})
