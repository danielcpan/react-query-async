import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const plugins = [peerDepsExternal(), commonjs(), typescript(), terser()];

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default [
  {
    input: ['src/core/index.ts'],
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true
      }
    ],
    preserveModules: true,
    plugins,
    external
  }
];
