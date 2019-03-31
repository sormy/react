import React from "react"

import Clock from "./Clock"
import FragmentedClock from "./FragmentedClock"
import Greeting from "./Greeting"
import PageStack from "./PageStack"
import Ticker from "./Ticker"

// PageStack is leaking... :-(
export default () => (
  <div>
    <div><Clock /></div>
    <div><Ticker /></div>
    <div><Ticker initialValue={1000} /></div>
    <div><Greeting /></div>
    <div><FragmentedClock /></div>
    <div><PageStack /></div>
  </div>
)
