import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { TermoFileStorage } from '../../../application/termos/services/termo-file-storage';

export class LocalTermoFileStorage implements TermoFileStorage {
  private readonly projectRoot = path.resolve(__dirname, '../../../..');
  private readonly baseDir = path.join(this.projectRoot, 'storage', 'termos');

  async save(fileName: string, content: Buffer): Promise<string> {
    await mkdir(this.baseDir, { recursive: true });

    const filePath = path.join(this.baseDir, fileName);
    await writeFile(filePath, content);

    return path.join('storage', 'termos', fileName);
  }

  async read(relativePath: string): Promise<Buffer> {
    const filePath = path.resolve(this.projectRoot, relativePath);

    return readFile(filePath);
  }

  async delete(relativePath: string): Promise<void> {
    const filePath = path.resolve(this.projectRoot, relativePath);

    await rm(filePath, { force: true });
  }
}
