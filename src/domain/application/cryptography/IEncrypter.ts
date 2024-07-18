export interface IEncrypter {
  encrypt(payload: Record<string, unknown>): Promise<string>
}
