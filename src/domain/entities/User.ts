import { Entity } from "@/core/entities/Entity"
import { Optional } from "@/core/types/optional"

export type UserProps = {
  name: string
  userName: string
  password: string
  parentUserId?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps> {
  get name(){
    return this.props.name
  }

  set userName(userName: string){
    this.props.userName = userName
    this.touch()
  }

  get userName(){
    return this.props.userName
  }

  get password(){
    return this.props.password
  }

  set password(password: string){
    this.props.password = password
    this.touch()
  }

  get parentUserId(){
    return this.props.parentUserId
  }

  set parentUserId(parentUserId: string){
    this.props.parentUserId = parentUserId
    this.touch()
  }

  set name(name: string){
    this.props.name = name
    this.touch()
  }

  get createdAt(){
    return this.props.createdAt
  }

  get updatedAt(){
    return this.props.updatedAt
  }

  private touch(){
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: string){
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)

    return user
  }
}