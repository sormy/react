# React for ancient IE 6/7

**THIS IS REACT 14 BRANCH, IT IS STABLE AND READY FOR PROD.**

**THERE IS ALSO DEVELOPMENT REACT 16 BRANCH, UNFORTUNATELY IT HAS ISSUES, NOT READY FOR PROD.**

## Goal

The goal of this fork is to run React applications on Internet Explorer Mobile 6/7 running
on Windows CE 6/7 (used on some embedded devices, like MC31/MC32 hand scanners).

This is the fork of React 0.14.x that is working on IE6/7.

The test application is working well and much faster and stable on IE 6/7 than 16.6.x forked version:
https://github.com/sormy/react-ie/tree/16-dev-ie

Inspired by these set of fixes: https://github.com/mtsyganov/react/commit/696726209554e8e6ba8ae8bdc843248922f822bf

See an example in `example` directory.

## Status

This version works pretty stable, no memory leaks on IE 6/7.

## Example

Please look on "/example" directory to see how does it work.

Example requires latest Node. This example imports React sources as it is.

## Building

```
# Install Node.JS 4.x
brew install nvm
mkdir ~/.nvm
export NVM_DIR="$HOME/.nvm"
. "/usr/local/opt/nvm/nvm.sh"
nvm install 4
nvm use 4

# clone repo
git clone https://github.com/sormy/react-ie.git
cd react-ie

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

## Altered packages

These packages were fixed for IE 6/7 compatibility:

- react
- react-dom

## Incompatibilities

Vanilla React incompatibilities with IE 6/7:

- `node.style` is not available
- `hasAttribute()` is not available
- `setAttribute(property, '')` removes the property instead of setting it
- get/set propery descriptors are not available
- no `change`  event on input fields
- `string[index]` is not available, use `string.charAt(index)` instead
- animation/transition events are not available
- `document.querySelectorAll()` is not available

## Transpilation

The result file should be transpiled with the following options to run on IE 6/7:

- target: es3 (or es5)
- loose: true
- es3 reserved keywords escaping

## License

React is [MIT licensed](./LICENSE).
