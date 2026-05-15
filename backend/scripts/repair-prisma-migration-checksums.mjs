import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '..');

const migrations = [
  '20260514010234_add_voluntarios',
  '20260514_add_oficinas',
  '20260514_add_atuacoes',
];

const sql = [
  'BEGIN;',
  ...migrations.map((migrationName) => {
    const filePath = path.join(
      backendRoot,
      'prisma',
      'migrations',
      migrationName,
      'migration.sql',
    );
    const checksum = createHash('sha256')
      .update(readFileSync(filePath))
      .digest('hex');

    return `UPDATE "_prisma_migrations" SET checksum = '${checksum}' WHERE migration_name = '${migrationName}';`;
  }),
  'COMMIT;',
].join('\n');

const prismaCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(
  prismaCommand,
  ['prisma', 'db', 'execute', '--schema', 'prisma/schema.prisma', '--stdin'],
  {
    cwd: backendRoot,
    input: sql,
    stdio: ['pipe', 'inherit', 'inherit'],
  },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('Checksums de migrations Prisma atualizados com sucesso.');
