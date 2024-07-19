import { User } from '@/domain/entities/User'

export class UserPresenter {
  static toHttp(user: User) {
    return {
      id: user.id,
      name: user.name,
      userName: user.userName,
      parentUserId: user.parentUserId ?? null,
      created_at: user.createdAt,
      updated_at: user.updatedAt ?? null,
    }
  }
}
