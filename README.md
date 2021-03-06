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

## Usage - patch

This is convinient way if you are not using precompiled build artifacts from `dist`
folder and have your own rollup/wepack configuration that bundles react using
source files.

For this case it is just enough to update npm source files excluding `dist` files.
You can build patch file and apply it on top of vanilla react in postinstall hook.

### Building patch file

Branch `0.14-stable` is almost full copy of vanilla branch but has one small fix
to successfully run build process on modern node, so building won't require nvm
dark magic.

```
# use Node 10/11 to avoid "ReferenceError: primordials is not defined"
# see https://stackoverflow.com/questions/55921442/how-to-fix-referenceerror-primordials-is-not-defined-in-node
brew install nvm
nvm install 11
nvm use 11

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
diff -urN build.old/packages/react build/packages/react
# save diff for npm react lib > react-0.14.9-oldie.patch
diff -urN build.old/packages/react/lib build/packages/react/lib > react-0.14.9-oldie.patch
```

### Install hook

The patch could be auto applied on npm installation phase, see example `package.json`:

```json
{
  "dependencies": {
    "react": "^0.14.9",
    "react-dom": "^0.14.9",
  },
  "scripts": {
    "patch-react": "test ! -f ./node_modules/react/.patched && cd ./node_modules/react && patch -p3 < ../../patches/react-0.14.9-oldie.patch && touch .patched || true",
    "postinstall": "npm run patch-react"
  }
}
```

## Bundling

Build artifacts of this package can't be used on IE 6/7 without transpilation.

I got it working using rollup + babel + polyfills + some minor patches. You could see
a working example in `example-oldie` directory.

Full ES3 support is available in `babel@7` using `@babel/preset-env` since `v7.4.3`.

```js
module.exports = {
  presets: [
    // transform-function-name is breaking React 0.14.x: '_renderedComponent' is null or not an object
    // generators are not supported on IE7, use fast-async instead in default promises mode
    ["@babel/preset-env", {
      targets: ["IE 7"],
      loose: true, /* es3 */
      exclude: [
        "transform-function-name",
        "transform-regenerator",
        "transform-async-to-generator"
      ]
    }],
    ["@babel/preset-react", { development: false }],
    "@babel/preset-typescript"
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties",   { loose: true /* es3 */ }],
    ["@babel/plugin-proposal-object-rest-spread", { loose: true /* es3 */ }],
    // Adds support for async/await using Promises
    "module:fast-async",
    // Adds React component name that helps debugging on minified builds
    "babel-plugin-add-react-displayname",
    // Replaces process.env.NODE_ENV during build time
    "babel-plugin-transform-inline-environment-variables",
    // Strip PropTypes to improve performance in production
    "babel-plugin-transform-react-remove-prop-types",
    // React optimizations to improve performance in production
    "@babel/plugin-transform-react-constant-elements",
    "@babel/plugin-transform-react-inline-elements",
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
