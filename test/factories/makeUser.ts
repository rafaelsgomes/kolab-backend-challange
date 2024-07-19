import { User, UserProps } from '@/domain/entities/User'
import { faker } from '@faker-js/faker'
import { User as TypeormUser } from '@/infra/database/typeOrm/entities/User.entity'
import { randomUUID } from 'node:crypto'
import { TypeormUserMapper } from '@/infra/database/typeOrm/mappers/typeormUserMapper'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { TypeormService } from '@/infra/database/typeorm.service'

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      userName: faker.internet.userName(),
      password: faker.internet.password({
        length: 20,
      }),
      parentUserId: randomUUID(),
      ...override,
    },
    id,
  )

  return user
}
@Injectable()
export class UserFactory {
  private repository: Repository<TypeormUser>
  constructor(private typeormService: TypeormService) {
    this.repository = this.typeormService.getRepository(TypeormUser)
  }

  async makeTypeormUser(override: Partial<UserProps>) {
    const user = makeUser(override)

    await this.repository.save(TypeormUserMapper.toDatabase(user))

    return user
  }
}
