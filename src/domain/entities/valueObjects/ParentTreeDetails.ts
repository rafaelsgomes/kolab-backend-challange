import { ValueObject } from './valueObject'

export type ParentTreeDetailsProps = {
  parent: {
    name: string
    userName: string
  }
  subordinates: {
    name: string
    userName: string
    createdAt: Date
    updatedAt?: Date | null
  }[]
}

export class ParentTreeDetails extends ValueObject<ParentTreeDetailsProps> {
  get parent() {
    return this.props.parent
  }

  get subordinates() {
    return this.props.subordinates
  }

  static create(props: ParentTreeDetailsProps) {
    return new ParentTreeDetails(props)
  }
}
