import React from "react"
import ReactDOM from "react-dom"

import transitionGroup from "react-transition-group"
import PropTypes from "prop-types"

import classNames from "classnames"

// useful to perform AJAX requests on IE6/7 (fetch polyfills are buggy on IE6/7)
import $ from "jquery"

window.React = React
window.ReactDOM = ReactDOM
window.React.PropTypes = PropTypes
window.React.transitionGroup = transitionGroup

window.$ = $

window.classNames = classNames
