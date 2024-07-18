import { IHasher } from '@/domain/application/cryptography/IHasher'

export class InMemoryHasher implements IHasher {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
