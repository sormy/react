import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import serve from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'
import copy from 'rollup-plugin-copy-glob'
import { uglify } from 'rollup-plugin-uglify'
import sourcemaps from 'rollup-plugin-sourcemaps'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import progress from 'rollup-plugin-progress'
import alias from 'rollup-plugin-alias'
import includePaths from 'rollup-plugin-includepaths'

import autoprefixer from 'autoprefixer'

const isServe = process.env.SERVE
const isProd = process.env.NODE_ENV === 'production'

// option ie8 is needed to make minified version compatible also with IE6/7 versions
const uglifyOpts = { ie8: true }

const babelOpts = {
  sourceMaps: true,
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  compact: false,
  presets: [
    // transform-function-name is breaking React 0.14.x: '_renderedComponent' is null or not an object
    ['@babel/preset-env', { loose: true /* es3 */, exclude: ['transform-function-name'] }],
    ['@babel/preset-react', { development: !isProd }],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
  ],
  plugins: [
    'transform-es3-member-expression-literals', // es3
    'transform-es3-property-literals',          // es3
    ['@babel/proposal-class-properties', { loose: true /* es3 */ }],
    ['@babel/proposal-object-rest-spread', { loose: true /* es3 */ }]
  ]
}

if (isProd) {
  babelOpts.plugins.push('transform-react-remove-prop-types')
}

const resolveOpts = {
  browser: true,
  jsnext: true,
  extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
}

// module => global variable map
const vendorMappings = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'react-transition-group': 'React.transitionGroup',
  'prop-types': 'React.PropTypes',
  'classnames': 'classNames',
  'jquery': '$',
  'object-assign': 'Object.assign'
}

// resources to copy to dist without transformations
const resources = [
  { files: 'src/index.html', dest: 'dist' },
  { files: 'src/resources/**', dest: 'dist/resources' },
  // responsive CSS for IE6/7
  { files: 'node_modules/respond.js/dest/respond.min.js', dest: 'dist/resources' },
  // the only way to get debugging console on IE6/7
  { files: !isProd ? 'node_modules/firebug-lite/build/firebug-*.js' : 'dummy', dest: 'dist/resources/firebug-lite' },
  { files: !isProd ? 'node_modules/firebug-lite/skin/**' : 'dummy', dest: 'dist/resources/firebug-lite/skin' },
]

export default [
  {
    input: 'src/polyfill-ie.js',
    output: {
      file: 'dist/resources/polyfill-ie.js',
      format: 'iife'
    },
    plugins: [
      resolve(resolveOpts),
      babel(babelOpts),
      commonjs(),
      isProd ? uglify(uglifyOpts) : undefined
    ]
  },{
    input: 'src/vendor.js',
    output: {
      file: 'dist/resources/vendor.js',
      format: 'iife',
      globals: {
        'json3': 'JSON'
      }
    },
    external: [
      'json3' // already imported in polyfill-ie
    ],
    plugins: [
      sourcemaps(),
      progress({
        clearLine: false
      }),
      includePaths({
        paths: [
          'node_modules/fbjs/lib',
          '../src',
          '../src/addons',
          '../src/addons/link',
          '../src/addons/transitions',
          '../src/isomorphic',
          '../src/isomorphic/children',
          '../src/isomorphic/classic',
          '../src/isomorphic/classic/class',
          '../src/isomorphic/classic/element',
          '../src/isomorphic/classic/types',
          '../src/isomorphic/deprecated',
          '../src/isomorphic/modern',
          '../src/isomorphic/modern/class',
          '../src/isomorphic/modern/element',
          '../src/isomorphic/modern/types',
          '../src/renderers',
          '../src/renderers/dom',
          '../src/renderers/dom/client',
          '../src/renderers/dom/client/eventPlugins',
          '../src/renderers/dom/client/syntheticEvents',
          '../src/renderers/dom/client/utils',
          '../src/renderers/dom/client/wrappers',
          '../src/renderers/dom/server',
          '../src/renderers/dom/shared',
          '../src/renderers/shared',
          '../src/renderers/shared/event',
          '../src/renderers/shared/event/eventPlugins',
          '../src/renderers/shared/reconciler',
          '../src/shared',
          '../src/shared/stubs',
          '../src/shared/utils',
          '../src/shared/vendor',
          '../src/shared/vendor/third_party',
          '../src/test'
        ]
      }),
      alias({
        resolve: ['.js'],
        'react': __dirname + '/../src/React',
        'react-dom': __dirname + '/../src/renderers/dom/ReactDOM',
        'Object.assign': 'object-assign'
      }),
      resolve(resolveOpts),
      babel(babelOpts),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProd ? "production" : "development"),
        '__DEV__': !isProd
      }), // for react
      isProd ? uglify(uglifyOpts) : undefined
    ]
  },{
    input: 'src/index.tsx',
    output: {
      file: 'dist/resources/app.js',
      format: 'iife',
      sourcemap: true,
      globals: vendorMappings
    },
    external: Object.keys(vendorMappings),
    plugins: [
      sourcemaps(),
      resolve(resolveOpts),
      babel(babelOpts),
      isProd ? uglify(uglifyOpts) : undefined,
      postcss({
        extract: true,
        plugins: [autoprefixer],
        use: [
          ['sass', { includePaths: ['node_modules'] }]
        ],
        sourceMap: true,
        minimize: isProd
      }),
      copy(resources),
      isServe ? serve({
        contentBase: 'dist',
        host: '0.0.0.0',
        port: 8887
      }) : undefined,
    ],
    watch: {
      clearScreen: false
    }
  }
]
