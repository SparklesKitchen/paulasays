// shot.js — screenshot critique harness (per the FABLE 25 guide, ~25 lines)
// usage: node tools/shot.js <url> <out.png> [1440x900] [waitMs] [scrollY]
const puppeteer = require('puppeteer');

(async () => {
  const [url, out, size = '1440x900', wait = '2500', scrollY = '0'] = process.argv.slice(2);
  const [width, height] = size.split('x').map(Number);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox', '--disable-gpu'] });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  if (Number(scrollY) > 0) {
    await page.evaluate(y => window.scrollTo(0, y), Number(scrollY));
    await new Promise(r => setTimeout(r, 800));
  }
  await new Promise(r => setTimeout(r, Number(wait)));
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: out });
  await browser.close();
  console.log(JSON.stringify({ out, docHeight, errors }));
})().catch(e => { console.error(JSON.stringify({ fatal: String(e) })); process.exit(1); });
