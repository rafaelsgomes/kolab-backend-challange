import { User } from '@/domain/entities/User'
import { User as TypeormUser } from '../entities/User.entity'

export class TypeormUserMapper {
  static toDatabase(user: User): TypeormUser {
    return new TypeormUser({
      id: user.id,
      name: user.name,
      userName: user.userName,
      password: user.password,
      parentUserId: user.parentUserId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? null,
    })
  }

  static toDomain(raw: TypeormUser) {
    return User.create(
      {
        name: raw.name,
        userName: raw.userName,
        password: raw.password,
        parentUserId: raw.parentUserId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? null,
      },
      raw.id,
    )
  }
}
