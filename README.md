# React for ancient IE 6/7

## Goal

The goal of this fork is to run React applications on Internet Explorer Mobile 6/7 running
on Windows CE 6/7 (used on some embedded devices, like MC31/MC32 hand scanners).

This is the fork of React 16.x that is working on IE6/7.

The test application is working well but it is working on IE6/7 much slower than React 14.x fork.

I also found that React 16.x is leaking on IE6/7, most likely due to garbage collector bugs
in IE6/7 (cross-references between DOM and JavaScript objects in fiber core).

Inspired by these set of fixes: https://github.com/mtsyganov/react/commit/696726209554e8e6ba8ae8bdc843248922f822bf

## Status

This version looks working but on some examples it is leaking. Feel free to submit a PR if you will
find a way to fix memory leak issue.

Please use React 14.x version of this package if you need more stable React on IE6/7 without memory
leaks but without Fragment support: https://github.com/sormy/react-ie/tree/0.14-stable-ie

## Altered packages

These packages were fixed for IE 6/7 compatibility:

- react
- react-dom
- react-reconciler (dependency)
- events (dependency)

## Incompatibilities

Vanilla React incompatibilities with IE 6/7:

- `Set` is not available, no perfect polyfill but Sets are mostly used in DEV-hooks
- `Map` is not available, no perfect polyfill but Maps are mostly used in DEV-hooks
- `node.style` is not available
- `hasAttribute()` is not available
- `setAttribute(property, '')` removes the property instead of setting it
- `textContent` is not available
- get/set propery descriptors are not available
- no `focus`/`blur` events, use `focusin`/`focusout` instead
- no `change`  event on input fields
- `string[index]` is not available, use `string.charAt(index)` instead

## Transpilation

The result file should be transpiled with the following options to run on IE 6/7:

- target: es3 (or es5)
- loose: true
- es3 reserved keywords escaping

## TODO

- (IMPORTANT) find why it is leaking, see PageStack component
- the included polyfill is not perfect, it is better to replace `new Set()` with alternative implementation
- the included polyfill is not perfect, it is better to replace `new Map()` with alternative implementation
- add notes for all changes
- verify `select` tag
- add better and performant recycle for textNodes
- detect if property accessors are available and disable `__DEV__` parts of code only if property
  accessors are no available instead of commenting them for all platforms

## License

React is [MIT licensed](./LICENSE).
