export interface TermoFileStorage {
  save(fileName: string, content: Buffer): Promise<string>;
  read(path: string): Promise<Buffer>;
}
