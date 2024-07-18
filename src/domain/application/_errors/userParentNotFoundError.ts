import { IError } from '@/core/errors/IError'

export class UserParentNotFoundError extends Error implements IError {
  constructor() {
    super(`User parent not found.`)
  }
}
