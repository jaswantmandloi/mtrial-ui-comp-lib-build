//import { promises as fs, existsSync } from 'fs';
// import path from 'path';
// import zlib from 'zlib';
// import { promisify } from 'util';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

//const gzip = promisify(zlib.gzip);
const rootPath = String(__dirname).replace('scripts', '');
const input = `${rootPath}src/index.js`;
const buildPath = `${rootPath}build`;
// const nodeModulesPath = `${rootPath}/node_modules`;
// console.log({ input, buildPath });
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};
const babelOptions = {
  exclude: /node_modules/,
  // We are using @babel/plugin-transform-runtime
  runtimeHelpers: true,
  extensions: ['.js', '.ts', '.tsx'],
  configFile: `${rootPath}babel.config.js`,
  //path.resolve(__dirname, '../babel.config.js'),
};
const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
  namedExports: {
    'prop-types/index.js': ['elementType', 'bool', 'func', 'object', 'oneOfType', 'element'],
    'react/jsx-runtime': ['jsx', 'jsxs'],
    'react-is/index.js': [
      'ForwardRef',
      'isFragment',
      'isLazy',
      'isMemo',
      'Memo',
      'isValidElementType',
    ],
  },
};
const nodeOptions = {
  extensions: ['.js', '.tsx', '.ts'],
};

function onwarn(warning) {
  if (
    warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
    warning.source === 'react' &&
    warning.names.filter((identifier) => identifier !== 'useDebugValue').length === 0
  ) {
    // only warn for
    // import * as React from 'react'
    // if (__DEV__) React.useDebugValue()
    // React.useDebug not fully dce'd from prod bundle
    // in the sense that it's still imported but unused. Downgrading
    // it to a warning as a reminder to fix at some point
    console.warn(warning.message);
  } else {
    //throw Error(warning.message);
    console.log({ error: warning.message });
  }
}

const commonPlugins = [
  nodeResolve(nodeOptions),
  babel(babelOptions),
  commonjs(commonjsOptions),
  nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
  peerDepsExternal(),
];

export default [
  {
    input,
    onwarn,
    output: {
      file: `${buildPath}/umd/material-ui.development.js`,
      format: 'umd',
      name: 'MaterialUI',
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      ...commonPlugins,
      replace({ preventAssignment: true, 'process.env.NODE_ENV': JSON.stringify('development') }),
    ],
  },
  {
    input,
    onwarn,
    output: {
      file: `${buildPath}/umd/material-ui.production.min.js`,
      format: 'umd',
      name: 'MaterialUI',
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      ...commonPlugins,
      replace({ preventAssignment: true, 'process.env.NODE_ENV': JSON.stringify('production') }),
      terser(),
    ],
  },
];
