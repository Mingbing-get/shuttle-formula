const {
  readFile,
  writeFile,
  readdirSync,
  statSync,
  existsSync,
  readFileSync,
} = require('fs')
const { resolve } = require('path')
const { build } = require('vite')
const dts = require('vite-plugin-dts')
const react = require('@vitejs/plugin-react')
const vue = require('@vitejs/plugin-vue')
const pkg = require(resolve(`package.json`))

main()

async function main() {
  const packages = readdirSync(resolve(__dirname, '../packages'))
  const effectPackages = packages.filter((packageName) => {
    const dirPath = resolve(__dirname, '../packages', packageName)

    return (
      statSync(dirPath).isDirectory() &&
      existsSync(resolve(dirPath, 'src', 'index.ts'))
    )
  })

  await Promise.all(effectPackages.map(buildWithWriteFile))

  await addMainPackageJson()
  await addMainReadMe()
}

async function buildWithWriteFile(target) {
  await startBuild(target)
  await addPackageJson(target)
  await addReadMe(target)
}

async function startBuild(target) {
  const extraPlugin = target.includes('react') ? [react()] : []
  if (target.includes('vue')) {
    extraPlugin.push(vue())
  }

  await build({
    plugins: [
      ...extraPlugin,
      dts.default({
        outDir: resolve(__dirname, `../dist/${target}/`),
        exclude: ['vite.config.ts', '/packages/*/src/**/__test__/**/*'],
        include: [`packages/${target}/src/**/*`],
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, `../packages/${target}/src/index.ts`),
        name: 'index',
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'vue',
          'wonderful-marrow/rabbit',
          'core',
          'render',
        ],
        output: [
          {
            format: 'umd',
            name: 'index',
            assetFileNames: 'index.[ext]',
            paths: {
              core: '../core',
              render: '../render',
            },
          },
          {
            format: 'es',
            name: 'index',
            assetFileNames: 'index.[ext]',
            paths: {
              core: '../core',
              render: '../render',
            },
          },
        ],
      },
      outDir: resolve(__dirname, `../dist/${target}/`),
    },
  })
}

async function addMainPackageJson() {
  const dir = resolve(__dirname, '../dist')
  const fileName = resolve(dir, 'package.json')

  const data = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    keywords: pkg.keywords,
    author: pkg.author,
    license: pkg.license,
    repository: pkg.repository,
    homepage: pkg.homepage,
  }

  return new Promise((resolve, reject) => {
    writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

async function addPackageJson(target) {
  const dir = resolve(__dirname, '../dist', target)
  const fileName = resolve(dir, 'package.json')

  const targetPkg = JSON.parse(
    readFileSync(resolve(__dirname, `../packages/${target}/package.json`)),
  )

  const data = {
    name: targetPkg.name,
    version: pkg.version,
    description: targetPkg.description,
    main: './index.umd.js',
    module: './index.es.js',
    types: './types/index.d.ts',
  }

  if (targetPkg.peerDependencies) {
    data.peerDependencies = targetPkg.peerDependencies
  }

  return new Promise((resolve, reject) => {
    writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

async function addMainReadMe() {
  const dir = resolve(__dirname, '../dist')
  const fileName = resolve(dir, 'README.md')

  return new Promise((ok, reject) => {
    readFile(resolve('README.md'), (err, data) => {
      if (err) {
        reject(err)
        return
      }
      writeFile(fileName, data, (err) => {
        if (err) reject(err)
        else ok()
      })
    })
  })
}

async function addReadMe(target) {
  const fileName = resolve(__dirname, '../dist', target, 'README.md')

  return new Promise((ok, reject) => {
    readFile(
      resolve(__dirname, '../packages', target, 'README.md'),
      (err, data) => {
        if (err) {
          reject(err)
          return
        }
        writeFile(fileName, data, (err) => {
          if (err) reject(err)
          else ok()
        })
      },
    )
  })
}
