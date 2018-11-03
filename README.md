# React for ancient IE 6/7

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
