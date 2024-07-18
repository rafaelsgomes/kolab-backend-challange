import { InvalidCredentialsError } from '../_errors/invalidCredentialsError'
import { IEncrypter } from '../cryptography/IEncrypter'
import { IHasher } from '../cryptography/IHasher'
import { IUsersRepository } from '../repositories/IUsersRepository'

type AuthenticateUserUseCaseRequest = {
  userName: string
  password: string
}

type AuthenticateUserUseCaseResponse = {
  token: string
}

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHasher,
    private encrypter: IEncrypter,
  ) {}

  async execute({
    userName,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByUseName(userName)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatch = await this.hasher.compare(password, user.password)

    if (!passwordMatch) {
      throw new InvalidCredentialsError()
    }

    const token = await this.encrypter.encrypt({
      sub: user.id,
    })

    return {
      token,
    }
  }
}
