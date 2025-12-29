import { resolve } from 'path'
import { UserConfig, PluginOption } from 'vite'
import dts from 'vite-plugin-dts'
// @ts-ignore 无法解析类型声明，但运行时可用
import nodeExternals from 'vite-plugin-node-externals'

export default function createViteConfig(
  name: string,
  outDir: string,
  plugins: PluginOption[] = [],
): UserConfig {
  return {
    plugins: [
      ...plugins,
      dts({
        entryRoot: './src',
        outDir: resolve(outDir, 'dist', 'types'),
      }),
      nodeExternals(),
    ],
    build: {
      lib: {
        entry: './src/index.ts',
        name,
        fileName: 'index',
      },
      rollupOptions: {
        external: ['@shuttle-formula/*', 'node_modules'],
        output: [
          {
            format: 'es',
            entryFileNames: '[name].mjs',
            preserveModules: true, // 保留原始文件结构
            exports: 'named',
            dir: resolve(outDir, 'dist', 'es'), // 输出到 'es' 目录
            preserveModulesRoot: 'src',
          },
          {
            format: 'cjs',
            entryFileNames: '[name].cjs',
            preserveModules: true,
            exports: 'named',
            dir: resolve(outDir, 'dist', 'cjs'), // 输出到 'cjs' 目录
            preserveModulesRoot: 'src',
          },
        ],
      },
    },
  }
}
