const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1800, deviceScaleFactor: 1 });
  const fileUrl = 'file://' + path.resolve(__dirname, 'index.html');

  const pdfStyleOverrides = `
    .reveal{opacity:1!important;transform:none!important;transition:none!important}
    .topbar,.footer,.portrait-cap{display:none!important}
    body{padding-bottom:0!important}
  `;

  for (const lang of ['en', 'es']) {
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.evaluate((l) => setLang(l), lang);
    await page.addStyleTag({ content: pdfStyleOverrides });
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 600));
    await page.emulateMediaType('screen');
    await page.pdf({
      path: `cv-${lang}.pdf`,
      format: 'A4',
      printBackground: true,
      margin: { top: '8mm', bottom: '8mm', left: '8mm', right: '8mm' },
      preferCSSPageSize: false,
    });
    console.log(`Generated cv-${lang}.pdf`);
  }

  await browser.close();
})();
