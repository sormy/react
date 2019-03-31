import React, { Component } from "react"

export interface ClockState {
  date: Date
}

export default class Clock extends Component<{}, ClockState> {
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
      <span className="clock">Date: {this.state.date.toString()}</span>
    )
  }
}
