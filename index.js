const puppeteer = require('puppeteer')
const PDFMerge = require('easy-pdf-merge')
const { join } = require('path')
const { dev } = require('vuepress')
const { fs, logger, chalk } = require('@vuepress/shared-utils')
const { stringify } = require('querystring')
const { red, yellow, gray } = chalk

// Keep silent before running custom command.
logger.setOptions({ logLevel: 1 })

module.exports = (opts = {}, ctx) => ({
  name: 'vuepress-plugin-export',

  chainWebpack(config) {
    config.plugins.delete('bar')
    // TODO vuepress should give plugin the ability to remove this plugin
    config.plugins.delete('vuepress-log')
  },

  extendCli(cli) {
    cli
      .command('export [targetDir]', 'export current vuepress site to a PDF file')
      .allowUnknownOptions()
      .action(async (dir = '.') => {
        dir = join(process.cwd(), dir)
        try {
          const nCtx = await dev({
            sourceDir: dir,
            clearScreen: false,
            theme: opts.theme || '@vuepress/default'
          })
          logger.setOptions({ logLevel: 3 })
          logger.info(`Start to generate current site to PDF ...`)
          try {
            // await generatePDF(ctx, nCtx.devProcess.port, nCtx.devProcess.host)
            await generatePDF(ctx, nCtx.devProcess.port, 'localhost')
          } catch (error) {
            console.error(red(error))
          }
          nCtx.devProcess.server.close()
          process.exit(0)
        } catch (e) {
          throw e
        }
      })
  }
})

function eachPathByNav(navList) {
  var pathOrders = []
  navList.forEach((nav,index) => {
      if (nav.items != null && nav.items != undefined) {
          var ep = eachPathByNav(nav.items)
          if (ep.length > 0) {
              ep.forEach((v, i) => pathOrders.push(v));
          }
      } else {
          pathOrders.push(nav.link)
      }
  })
  return pathOrders
}

async function generatePDF(ctx, port, host) {
  const { pages, tempPath, siteConfig,themeConfig } = ctx

  const pathOrders = eachPathByNav(themeConfig.nav)

  const tempDir = join(tempPath, 'pdf')
  fs.ensureDirSync(tempDir)

  let exportPages = pages.map(page => {

    const regexp = new RegExp(/[(\d)]/)
    const index = regexp.exec(page.path)
    const idx = index && index[0]
    return {
      index: idx,
      url: page.path,
      title: page.title,
      location: `http://${host}:${port}${page.path}`,
      path: `${tempDir}/${page.key}.pdf`
    }
  })

  exportPages.forEach((page,index)=>{
    var orderIndex = pathOrders.indexOf(page.url)
    if(orderIndex == -1){
        orderIndex = 9999
    }
    page.index = orderIndex
  })

  exportPages =  exportPages.sort((a, b) => a.index - b.index)

  const browser = await puppeteer.launch({args: ["--no-sandbox"]})
  const browserPage = await browser.newPage()

  for (let i = 0; i < exportPages.length; i++) {
    const {
      location,
      path: pagePath,
      url,
      title
    } = exportPages[i]

    await browserPage.goto(
      location,
      { waitUntil: 'networkidle2' }
    )

    await browserPage.evaluate(() => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        navbar.style.display = 'none';
      }
    });

    await browserPage.pdf({
      path: pagePath,
      format: 'A4'
    })

    logger.success(
      `Generated ${yellow(title)} ${gray(`${url}`)}`
    )
  }

  const files = exportPages.map(({ path }) => path)
  const outputFilename = siteConfig.title || 'site'
  const outputFile = `${outputFilename}.pdf`
  await new Promise(resolve => {
    PDFMerge(files, outputFile, err => {
      if (err) {
        throw err
      }
      logger.success(`Export ${yellow(outputFile)} file!`)
      resolve()
    })
  })

  await browser.close()
  fs.removeSync(tempDir)
}


