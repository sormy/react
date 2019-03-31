import React from "react"

// This is very naive implementation that is breaking styles.
if (!React.Fragment) {
  React.Fragment = class Fragment extends React.Component {
    render() {
      console.warn("React.Fragment usage detected. It is incompatible with TaskUI targeting React 0.14.x.")
      return React.createElement('div', null, this.props.children);
    }
  }
}
