import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/makeUser'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

describe('Fetch Parent Tree (E2E)', () => {
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

  test('[GET] /users/:parentId/tree', async () => {
    const parent = await userFactory.makeTypeormUser({
      name: 'John Doe 1',
      userName: 'johnDoe1',
      password: await hash('password123', 8),
    })

    const user = await userFactory.makeTypeormUser({
      name: 'John Doe',
      userName: 'johnDoe',
      password: await hash('password123', 8),
      parentUserId: parent.id,
    })

    const token = jwtService.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .get(`/users/${parent.id}/tree`)
      .set('Cookie', `access_token=${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.parentTreeDetails).toEqual(
      expect.objectContaining({
        parent: expect.objectContaining({
          name: 'John Doe 1',
        }),
        subordinates: expect.arrayContaining([
          expect.objectContaining({
            name: 'John Doe',
          }),
        ]),
      }),
    )
  })
  afterAll(async () => {
    await app.close()
  })
})
