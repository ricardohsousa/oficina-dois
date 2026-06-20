import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ASSETS_DIR = join(__dirname);

function loadImageAsBase64(filename: string): string {
  const filePath = join(ASSETS_DIR, filename);
  const buffer = readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

export function getBrasaoGovBase64(): string {
  return loadImageAsBase64('brasao_gov_br_oficial.png');
}

export function getUtfprLogoBase64(): string {
  return loadImageAsBase64('utfpr_logo.png');
}
