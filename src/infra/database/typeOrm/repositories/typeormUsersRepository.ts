import { IUsersRepository } from '@/domain/application/repositories/IUsersRepository'
import { User } from '@/domain/entities/User'
import { User as TypeormUser } from '../entities/User.entity'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { TypeormUserMapper } from '../mappers/typeormUserMapper'
import { TypeormService } from '../../typeorm.service'

@Injectable()
export class TypeormUsersRepository implements IUsersRepository {
  private repository: Repository<TypeormUser>
  constructor(private typeormService: TypeormService) {
    this.repository = this.typeormService.getRepository(TypeormUser)
  }

  async create(user: User): Promise<void> {
    await this.repository.save(TypeormUserMapper.toDatabase(user))
  }

  async save(user: User): Promise<void> {
    await this.repository.update(user.id, TypeormUserMapper.toDatabase(user))
  }

  async findByUserName(userName: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { userName } })

    if (!user) {
      return null
    }

    return TypeormUserMapper.toDomain(user)
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id: userId } })

    if (!user) {
      return null
    }

    return TypeormUserMapper.toDomain(user)
  }

  async findManyByParentId(parentId: string): Promise<User[]> {
    const users = await this.repository.find({
      where: { parentUserId: parentId },
    })

    return users.map(TypeormUserMapper.toDomain)
  }

  async delete(userId: string): Promise<void> {
    await this.repository.delete({ id: userId })
  }
}
