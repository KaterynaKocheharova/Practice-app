export interface IHashingService {
  hash(value: string): Promise<string>;
}
