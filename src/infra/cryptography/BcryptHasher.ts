import { IHasher } from '@/domain/application/cryptography/IHasher'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements IHasher {
  async hash(plain: string): Promise<string> {
    return hash(plain, 8)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
