# React for old IE 6/7

**THIS IS REACT 14 BRANCH, IT IS STABLE AND READY FOR PROD.**

## Goal

The goal of this fork is to run React applications on Internet Explorer Mobile 6/7 running
on Windows CE 6/7 (used on some embedded devices, like MC31/MC32 hand scanners).

This is the fork of React 0.14.x that is working on IE6/7.

The test application is working well and much faster and stable on IE 6/7 than 16.6.x forked version:
https://github.com/sormy/react-oldie/tree/16-dev-ie

Inspired by this set of fixes: https://github.com/mtsyganov/react/commit/696726209554e8e6ba8ae8bdc843248922f822bf

See an example in `example-oldie` directory.

## Status

This version works pretty stable, no memory leaks on IE 6/7.

## Example

Please look on `example-oldie` directory to see how does it work.

Example requires latest Node. This example imports React sources as it is.

## Installing

```
# Install Node.JS 4.x
brew install nvm
mkdir ~/.nvm
export NVM_DIR="$HOME/.nvm"
. "/usr/local/opt/nvm/nvm.sh"
nvm install 4
nvm use 4

# clone repo
git clone https://github.com/sormy/react-oldie.git
cd react-oldie

# build vanilla react
git checkout 0.14-stable
npm install
npm run build

# backup build artifacts
mv build build.old

# build patched react
git checkout 0.14-stable-ie
npm install
npm run build

# show diff for npm react
diff -ur build.old/packages/react build/packages/react
# show diff for npm react lib > react-0.14.9-ie.patch
diff -ur build.old/packages/react/lib build/packages/react/lib > react-0.14.9-ie-lib.patch
```

## Usage

The easiest way is to export difference as patch (see Building section).

Then patch could be auto applied on npm installation phase, see example `package.json`:

```
{
  "dependencies": {
    "react": "^0.14.9",
    "react-dom": "^0.14.9",
  },
  "scripts": {
    "patch-react": "test ! -f ./node_modules/react/.patched && cd ./node_modules/react && patch -p3 < ../../patches/react-0.14.9-ie-lib.patch && touch .patched || true",
    "postinstall": "npm run patch-react"
  }
}
```

## Bundling

Build artifacts of this package can't be used on IE 6/7 without transpilation.

I got it working using rollup + babel + polyfills + some minor patches. You could see
a working example in `example-oldie` directory.

Here is the recommended `babel@7` configuration to properly transpile source code:

```js
module.exports = {
  presets: [
    // transform-function-name is breaking React 0.14.x: '_renderedComponent' is null or not an object
    // generators are not supported on IE7, use fast-async instead in default promises mode
    ["@babel/env", {
      targets: ["IE 7"],
      loose: true, /* es3 */
      exclude: [
        "transform-function-name",
        "transform-regenerator",
        "transform-async-to-generator"
      ]
    }],
    ["@babel/react", { development: false }],
    "@babel/typescript"
  ],
  plugins: [
    ["@babel/proposal-class-properties",   { loose: true /* es3 */ }],
    ["@babel/proposal-object-rest-spread", { loose: true /* es3 */ }],
    // Transform es3 reserved keywords otherwise code won't be parsed
    "transform-es3-member-expression-literals",
    "transform-es3-property-literals",
    // Adds support for async/await using Promises
    "module:fast-async",
    // Adds React component name that helps debugging on minified builds
    "add-react-displayname",
    // Replaces process.env.NODE_ENV during build time
    "transform-inline-environment-variables",
    // React optimizations to improve performance in production
    "@babel/transform-react-constant-elements",
    "@babel/transform-react-inline-elements",
    // Strip PropTypes to improve performance in production
    "transform-react-remove-prop-types"
  ]
}
```

Recommended Polyfills:

- console stub
- stub error classes (used by es5-shim / es5-sham):
```js
window.EvalError = window.Error
window.InternalError = window.Error
window.RangeError = window.Error
window.ReferenceError = window.Error
window.SyntaxError = window.Error
window.TypeError = window.Error
window.URIError = window.Error
```
- `es5-shim` (es5-shim / es5-sham)
- `core-js` for some stuff
- `promise-polyfill` (optional)
- `json3` polyfill (optional)
- `typedarray` polyfill (optional)
- `setimmediate-modular` polyfill (optional)
- `requestAnimationFrame()` polyfill (optional)

Rollup configuration:

- `freeze: false`

Other issues that needs minor patching:

- rollup-plugin-commonjs: https://github.com/rollup/rollup-plugin-commonjs/issues/364
- babel: https://github.com/babel/babel/issues/9226 (just for babel-plugin-transform-react-constant-elements)

UglifyJS configuration:

```js
{
  ie8: true,
  mangle: {
    keep_fnames: true
  }
}
```

## License

React is [MIT licensed](./LICENSE).
