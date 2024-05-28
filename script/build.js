const {
  readdirSync,
  statSync,
  existsSync,
  readFileSync,
  writeFileSync,
} = require('fs')
const { resolve } = require('path')
const { build } = require('vite')
const dts = require('vite-plugin-dts')
const react = require('@vitejs/plugin-react')
const vue = require('@vitejs/plugin-vue')
const pkg = require(resolve(`package.json`))

const dtsBeforeWriteFile = require('./dtsBeforeWriteFile')
const { paths } = require('./config')

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
        beforeWriteFile: dtsBeforeWriteFile,
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
            paths: paths,
          },
          {
            format: 'es',
            name: 'index',
            assetFileNames: 'index.[ext]',
            paths: paths,
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

  writeFileSync(fileName, JSON.stringify(data, null, 2))
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

  writeFileSync(fileName, JSON.stringify(data, null, 2))
}

async function addMainReadMe() {
  const dir = resolve(__dirname, '../dist')
  const fileName = resolve(dir, 'README.md')

  const effectPackages = ['core', 'render', 'render-react', 'render-vue']
  let data = `# shuttle-formula

shuttle-formula是一个公式编辑器，支持公式解析、公式计算、原生js渲染、react渲染、vue渲染

`
  effectPackages.forEach((pkgName) => {
    const readMeText = readFileSync(
      resolve(__dirname, '../packages', pkgName, 'README.md'),
    )
    data += readMeText + '\n'
  })

  writeFileSync(fileName, data)
}

async function addReadMe(target) {
  const fileName = resolve(__dirname, '../dist', target, 'README.md')

  const data = readFileSync(
    resolve(__dirname, '../packages', target, 'README.md'),
  )
  writeFileSync(fileName, data)
}
