import { download } from '@/lib/http';

export async function downloadTermoVoluntariado(downloadUrl: string) {
  return download(downloadUrl, {
    method: 'GET'
  });
}
