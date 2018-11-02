// Not implemented in IE6
window.TypeError = window.Error
window.RangeError = window.Error
window.SyntaxError = window.Error

import "es5-shim/es5-shim"

import "es5-shim/es5-sham"

import "html5shiv"

import "console-polyfill"

import "promise-polyfill/src/polyfill"

import assign from "object-assign"

import json3 from "json3"

window.JSON = json3

// https://gist.github.com/jonathantneal/2869388
import "./polyfills/document.addEventListener"

import "./polyfills/Set"
import "./polyfills/Map"
import "./polyfills/requestAnimationFrame"

Object.assign = assign
