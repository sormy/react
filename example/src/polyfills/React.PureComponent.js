import React from "react"

import shallowCompare from "react-addons-shallow-compare"

// Modern React 16.x has React.PureComponent but React 0.14.x doesn't
if (!React.PureComponent) {
  React.PureComponent = class PureComponent extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState)
    }
  }
}
