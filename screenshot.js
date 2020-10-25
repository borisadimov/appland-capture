const puppeteer = require('puppeteer')

module.exports = function (url) {
  return new Promise((resolve, reject) => {
    ; (async () => {
      const browser = await puppeteer.launch({
        args: ['--no-sandbox']
      })

      const page = await browser.newPage()

      await page.setViewport({
        width: 1500,
        height: 900
      })


      await page.goto(url, {
        waitUntil: ['load', 'networkidle0', 'domcontentloaded']
      })

      await page.waitFor(1500)

      await page.emulateMediaType('screen')

      const buffer = await page.screenshot({
        type: 'png',
        clip: {
          x: 180,
          y: 56,
          width: 1140,
          height: 764
        }
      })

      await browser.close()

      resolve(buffer)
    })()
  })
}