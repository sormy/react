import React, { Component, Fragment } from "react"

export interface PageStackState {
  counter: number
}

export default class PageStack extends Component<{}, PageStackState> {
  private interval?: number

  constructor(props: {}) {
    super(props)
    this.state = { counter: 0 }
  }

  public componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  public componentWillUnmount() {
    clearInterval(this.interval)
  }

  public tick() {
    this.setState({ counter: this.state.counter + 1 })
  }

  public render() {
    const mod = this.state.counter % 10
    return (
      <Fragment>
        {mod === 0 && <span>First Page: 1 x {this.state.counter}</span>}
        {mod === 1 && <span>Second Page: 2 x {this.state.counter}</span>}
        {mod === 2 && <span>Third Page: 3 x {this.state.counter}</span>}
        {mod === 3 && <span>Fourth Page: 4 x {this.state.counter}</span>}
        {mod === 4 && <span>Fifth Page: 5 x {this.state.counter}</span>}
        {mod === 5 && <span>Sixth Page: 6 x {this.state.counter}</span>}
        {mod === 6 && <span>Seventh Page: 7 x {this.state.counter}</span>}
        {mod === 7 && <span>Eighth Page: 8 x {this.state.counter}</span>}
        {mod === 8 && <span>Nineth Page: 9 x {this.state.counter}</span>}
        {mod === 9 && <span>Tenth Page: 10 x {this.state.counter}</span>}
      </Fragment>
    )
  }
}
