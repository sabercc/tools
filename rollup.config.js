import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace';
import {
  terser
} from 'rollup-plugin-terser';
import pkg from './package.json';

const env = process.env.NODE_ENV;

const plugins = [
  babel({
    exclude: ['node_modules'], // 忽略 node_modules
    runtimeHelpers: true, // 开启体积优化
  }),
  resolve(),
  commonjs(),
  typescript(),
  replace({
    exclude: 'node_modules/**',
    'process.env.NODE_ENV': JSON.stringify(env || 'development')
  }),
  env === 'production' && terser(),
]

export default [
  {
    input: 'src/index.ts',
    output: [{
        name: 'tools',
        file: env === 'production' ? pkg.browser.replace(/\.js$/, '.min.js') : pkg.browser,
        format: 'umd',
        exports: 'auto'
      },
      {
        file: env === 'production' ? pkg.main.replace(/\.js$/, '.min.js') : pkg.main,
        format: 'cjs',
        exports: 'auto'
      },
      {
        file: env === 'production' ? pkg.module.replace(/\.js$/, '.min.js') : pkg.module,
        format: 'es',
        exports: 'auto'
      }
    ],
    plugins
  },
];