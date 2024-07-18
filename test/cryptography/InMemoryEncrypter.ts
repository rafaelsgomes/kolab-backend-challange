import { IEncrypter } from '@/domain/application/cryptography/IEncrypter'

export class InMemoryEncrypter implements IEncrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
