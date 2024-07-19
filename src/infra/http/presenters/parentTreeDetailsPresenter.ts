import { ParentTreeDetails } from '@/domain/entities/valueObjects/ParentTreeDetails'

export class ParentTreeDetailsPresenter {
  static toHttp(tree: ParentTreeDetails) {
    const { parent, subordinates } = tree
    return {
      parent,
      subordinates,
    }
  }
}
