import React, { Component, Fragment } from "react"

export interface FragementedClockState {
  date: Date
}

export default class FragmentedClock extends Component<{}, FragementedClockState> {
  private interval?: number

  constructor(props: {}) {
    super(props)
    this.state = { date: new Date() }
  }

  public componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 1000)
  }

  public componentWillUnmount() {
    clearInterval(this.interval)
  }

  public tick() {
    this.setState({ date: new Date() })
  }

  public render() {
    return (
      <Fragment>
        <div>{this.state.date.toString()}</div>
        <Fragment><div>{this.state.date.toString()}</div></Fragment>
      </Fragment>
    )
  }
}
