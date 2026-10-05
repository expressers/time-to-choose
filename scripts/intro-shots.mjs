import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' })
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
await page.goto(process.argv[2] || 'http://127.0.0.1:5191/', { waitUntil: 'domcontentloaded' })
const t0 = Date.now()
for (const ms of [700, 1300, 2200, 3000, 3700, 4300, 6000]) {
  await new Promise((r) => setTimeout(r, Math.max(0, ms - (Date.now() - t0))))
  await page.screenshot({ path: `.impeccable/review/intro-${ms}.jpg`, type: 'jpeg', quality: 70 })
}
await browser.close()
console.log('ok')
