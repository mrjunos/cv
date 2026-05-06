const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');

  for (const lang of ['en', 'es']) {
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.evaluate((l) => setLang(l), lang);
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 600));
    await page.emulateMediaType('screen');
    await page.pdf({
      path: `cv-${lang}.pdf`,
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
      preferCSSPageSize: false,
    });
    console.log(`Generated cv-${lang}.pdf`);
  }

  await browser.close();
})();
