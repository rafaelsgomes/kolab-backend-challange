import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { TypeormService } from '@/infra/database/typeorm.service'
import { User } from '@/infra/database/typeOrm/entities/User.entity'
import { UserFactory } from 'test/factories/makeUser'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'bcryptjs'

describe('Create User (E2E)', () => {
  let app: INestApplication
  let typeormService: TypeormService
  let userFactory: UserFactory
  let jwtService: JwtService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = appModule.createNestApplication()
    typeormService = appModule.get(TypeormService)
    userFactory = appModule.get(UserFactory)
    jwtService = appModule.get(JwtService)

    await app.init()
  })

  test('[PUT] /users', async () => {
    const user = await userFactory.makeTypeormUser({
      name: 'John Doe',
      userName: 'johnDoe',
      password: await hash('password123', 8),
    })

    const token = jwtService.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .put('/users')
      .set('Cookie', `access_token=${token}`)
      .send({
        name: 'John Doe - updated',
        userName: 'johnDoe2',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(204)
    const userOnDatabase = await typeormService
      .getRepository(User)
      .findOneBy({ userName: 'johnDoe2' })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase.name).toEqual('John Doe - updated')
  })
  afterAll(async () => {
    await app.close()
  })
})
