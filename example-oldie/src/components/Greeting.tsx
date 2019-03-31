import React, { Component, SyntheticEvent } from "react"

export interface GreetingState {
  status: "unknown" | "connected" | "disconnected"
  name: string
  greetings: string[]
}

export default class Greeting extends Component<{}, GreetingState> {
  private topic = "/topic/greetings"

  constructor(props: {}) {
    super(props)

    this.state = {
      status: "unknown",
      name: "",
      greetings: []
    }

    this.handleConnectClick = this.handleConnectClick.bind(this)
    this.handleDisconnectClick = this.handleDisconnectClick.bind(this)
    this.handleSendClick = this.handleSendClick.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  public handleConnectClick() {
    this.setState({ status: "connected" })
  }

  public handleDisconnectClick() {
    this.setState({ status: "disconnected", greetings: [] })
  }

  public handleSendClick() {
    const greeting = `Hello, ${this.state.name}`
    this.setState({ greetings: this.state.greetings.concat([greeting]) })
  }

  public handleNameChange(event: SyntheticEvent) {
    const input = event.target as HTMLInputElement
    this.setState({ name: input.value })
  }

  public renderGreetings(greetings: string[]) {
    return greetings.map((greeting: string, index: number) => {
      return <div key={index}>{greeting}</div>
    })
  }

  public render() {
    const connected = this.state.status === "connected"

    return (
      <div>
        <div>
          <div>Status: {this.state.status}</div>
          <button id="connect" onClick={this.handleConnectClick} disabled={connected}>Connect</button>
          <button id="disconnect" onClick={this.handleDisconnectClick} disabled={!connected}>Disconnect</button>
        </div>
        <div>
          Name:
          <input id="name" onChange={this.handleNameChange} value={this.state.name} type="text" disabled={!connected}/>
          <button id="send" onClick={this.handleSendClick} disabled={!connected}>Send</button>
        </div>
        <div style={{ display: connected ? "" : "none" }}>
          <div>Greetings ({this.state.greetings.length}):</div>
          <div>{this.renderGreetings(this.state.greetings)}</div>
        </div>
      </div>
    )
  }
}
