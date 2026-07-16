const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--allow-file-access-from-files',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1400, deviceScaleFactor: 1 });
  const pdfPath = path.resolve(__dirname, 'pdf', 'index.html');

  for (const lang of ['en', 'es', 'en-ai', 'es-ai']) {
    const url = 'file://' + pdfPath + '?lang=' + lang;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 300));
    await page.emulateMediaType('screen');
    await page.pdf({
      path: `cv-${lang}.pdf`,
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
    });
    console.log(`Generated cv-${lang}.pdf`);
  }

  await browser.close();
})();
