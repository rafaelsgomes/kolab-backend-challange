import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  userName: string

  @Column()
  password: string

  @Column({ nullable: true })
  parentUserId: string

  @Column()
  createdAt: Date

  @Column({ nullable: true })
  updatedAt: Date

  constructor(props: Partial<User>) {
    Object.assign(this, props)
  }
}
