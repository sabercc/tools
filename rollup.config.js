import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const plugins = [
  babel({
    exclude: ['node_modules'],                  // 忽略 node_modules
    runtimeHelpers: true,                       // 开启体积优化
  }),
  resolve(),
  commonjs(),
  typescript(),
  terser(),
]

export default [
  // UMD for browser-friendly build
  {
    input: 'src/index.ts',
    output: {
      name: 'tools',
			file: pkg.browser,
      format: 'umd',
      exports: 'auto'
    },
    plugins
  },
  // CommonJS for Node and ES module for bundlers build
  {
    input: 'src/index.ts',
    external: ['ms'],
    plugins,
    output: [
      {  file: pkg.main, format: 'cjs', exports: 'auto' },
      {  file: pkg.module, format: 'es', exports: 'auto' }
    ]
  }
];