import {h, render} from "preact"
import {App} from "./App"

if (!document.cookie) {
  document.cookie = Math.random().toString(36);
}

render(<App/>, document.getElementById("app"))
