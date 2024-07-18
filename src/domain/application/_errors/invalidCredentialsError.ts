import { IError } from '@/core/errors/IError'

export class InvalidCredentialsError extends Error implements IError {
  constructor() {
    super(`Invalid Credentials.`)
  }
}
