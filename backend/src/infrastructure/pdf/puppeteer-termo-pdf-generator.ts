import puppeteer from 'puppeteer';

import type {
  TermoPdfGenerator,
  TermoVoluntariadoPdfData,
} from '../../application/termos/services/termo-pdf-generator';
import { renderTermoVoluntariadoTemplate } from './templates/termo-voluntariado.template';

export class PuppeteerTermoPdfGenerator implements TermoPdfGenerator {
  async generate(data: TermoVoluntariadoPdfData): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(renderTermoVoluntariadoTemplate(data), {
        waitUntil: 'load',
      });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '16mm',
          right: '14mm',
          bottom: '16mm',
          left: '14mm',
        },
      });

      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }
}
