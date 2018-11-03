import React, { PureComponent } from "react"

export interface TickerProps {
  initialValue?: number
}

export interface TickerState {
  counter: number
}

export default class Ticker extends PureComponent<TickerProps, TickerState> {
  private interval?: number

  constructor(props: TickerProps) {
    super(props)
    this.state = { counter: props.initialValue || 0 }
    this.handleClick = this.handleClick.bind(this)
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

  public handleClick() {
    this.tick()
  }

  public render() {
    return (
      <span onClick={this.handleClick}>{this.props.initialValue || 0} / {this.state.counter}</span>
    )
  }
}
