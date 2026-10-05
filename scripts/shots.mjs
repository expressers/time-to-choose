// Capturas de verificação (desktop + mobile) com o Chrome local.
// uso: bun scripts/shots.mjs [url] [outdir]
import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const url = process.argv[2] || 'http://127.0.0.1:5191/?snap'
const out = process.argv[3] || '.impeccable/review'
fs.mkdirSync(out, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'],
})

const viewports = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
]
const points = [
  ['01-hero', 'top', 0],
  ['02-arr-a', 'pin:arrival', 0.02],
  ['03-arr-b', 'pin:arrival', 0.3],
  ['04-arr-mid', 'pin:arrival', 0.6],
  ['05-arr-d', 'pin:arrival', 0.98],
  ['06-services', 'services', 0.12],
  ['07-fleet', 'fleet', 0],
  ['08-stays', 'stays', 0.15],
  ['09-angola', 'angola', 0.08],
  ['10-promises', 'angola', 0.75],
  ['11-plan', 'plan', 0.1],
  ['12-foot', 'end', 0],
]
for (const vp of viewports) {
  const page = await browser.newPage()
  await page.setViewport(vp)
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
  page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
  await page.goto(url, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 3500))
  for (const [name, target, frac] of points) {
    await page.evaluate(({ target, frac }) => {
      let y = 0
      if (target === 'end') y = document.documentElement.scrollHeight
      else if (target.startsWith('pin:')) {
        const el = document.getElementById(target.slice(4))
        const top = el.getBoundingClientRect().top + window.scrollY
        y = top + (el.offsetHeight - window.innerHeight) * frac
      } else {
        const el = document.getElementById(target)
        y = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight * frac
      }
      window.scrollTo(0, y)
    }, { target, frac })
    await new Promise((r) => setTimeout(r, 1800))
    await page.screenshot({ path: `${out}/${vp.name}-${name}.jpg`, type: 'jpeg', quality: 70 })
  }
  await page.close()
}
await browser.close()
console.log('ok')
