import { User } from '@/domain/entities/User'

export abstract class IUsersRepository {
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract findByUserName(userName: string): Promise<User | null>
  abstract findById(userId: string): Promise<User | null>
  abstract findManyByParentId(parentId: string): Promise<User[]>
  abstract delete(userId: string): Promise<void>
}
