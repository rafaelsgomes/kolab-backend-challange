export abstract class IHasher {
  abstract hash(plain: string): Promise<string>
  abstract compare(plain: string, hash: string): Promise<boolean>
}