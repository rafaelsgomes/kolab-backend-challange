import { IError } from '@/core/errors/IError'

export class UserNotFoundError extends Error implements IError {
  constructor() {
    super(`User not found.`)
  }
}
