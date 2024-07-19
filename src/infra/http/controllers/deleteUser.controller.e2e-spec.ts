import request from 'supertest'
import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { UserFactory } from 'test/factories/makeUser'
import { hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { TypeormService } from '@/infra/database/typeorm.service'
import { User } from '@/infra/database/typeOrm/entities/User.entity'

describe('Delete User (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwtService: JwtService
  let typeormService: TypeormService
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = appModule.createNestApplication()
    userFactory = appModule.get(UserFactory)
    jwtService = appModule.get(JwtService)
    typeormService = appModule.get(TypeormService)

    await app.init()
  })

  test('[DELETE] /users/:userId', async () => {
    const user = await userFactory.makeTypeormUser({
      name: 'John Doe',
      userName: 'johnDoe',
      password: await hash('password123', 8),
    })

    const token = jwtService.sign({ sub: user.id })

    const response = await request(app.getHttpServer())
      .delete(`/users`)
      .set('Cookie', `access_token=${token}`)
      .send()

    expect(response.statusCode).toEqual(204)
    const userOnDatabase = await typeormService
      .getRepository(User)
      .findOneBy({ userName: 'johnDoe' })

    expect(userOnDatabase).toBeNull()
  })
  afterAll(async () => {
    await app.close()
  })
})
