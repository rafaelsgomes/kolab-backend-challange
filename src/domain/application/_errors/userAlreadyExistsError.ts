import { IError } from '@/core/errors/IError'

export class UserAlreadyExistsError extends Error implements IError {
  constructor(identifier: string) {
    super(`User ${identifier} already exists.`)
  }
}
