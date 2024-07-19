import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { User } from '@/domain/entities/User'
import { ParentTreeDetails } from '@/domain/entities/valueObjects/ParentTreeDetails'

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []

  async create(user: User): Promise<void> {
    this.items.push(user)
  }

  async save(user: User): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === user.id)

    this.items[userIndex] = user
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = this.items.find((item) => item.userName === userName)

    if (!user) {
      return null
    }

    return user
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === userId)

    if (!user) {
      return null
    }

    return user
  }

  async findManyByParentId(parentId: string): Promise<ParentTreeDetails> {
    const parent = this.items.find((item) => item.id === parentId)
    const users = this.items.filter((item) => item.parentUserId === parentId)

    const parentTreeDetails = ParentTreeDetails.create({
      parent: {
        name: parent.name,
        userName: parent.userName,
      },
      subordinates: users.map((item) => {
        return {
          name: item.name,
          userName: item.userName,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }
      }),
    })

    return parentTreeDetails
  }

  async delete(userId: string): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === userId)

    this.items.splice(userIndex, 1)
  }
}
