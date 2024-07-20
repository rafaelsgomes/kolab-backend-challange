import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/makeUser'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Logout User (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwtService: JwtService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = appModule.createNestApplication()
    userFactory = appModule.get(UserFactory)
    jwtService = appModule.get(JwtService)

    await app.init()
  })

  test('[DELETE] /users/logout', async () => {
    const user = await userFactory.makeTypeormUser({
      name: 'John Doe',
      userName: 'johnDoe',
      password: await hash('password123', 8),
    })

    const token = jwtService.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .delete(`/users/logout`)
      .set('Cookie', `access_token=${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
    // eslint-disable-next-line dot-notation
    expect(response.headers['set-cookie'][0]['access_token']).toBeUndefined()
  })
  afterAll(async () => {
    await app.close()
  })
})
