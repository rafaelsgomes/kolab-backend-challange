import { User } from '@/domain/entities/User'
import { ParentTreeDetails } from '@/domain/entities/valueObjects/ParentTreeDetails'

export abstract class IUsersRepository {
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract findByUserName(userName: string): Promise<User | null>
  abstract findById(userId: string): Promise<User | null>
  abstract findManyByParentId(parentId: string): Promise<ParentTreeDetails>
  abstract delete(userId: string): Promise<void>
}
