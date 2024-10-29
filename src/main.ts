import "@xterm/xterm/css/xterm.css"
import { FitAddon } from "@xterm/addon-fit"
import { ImageAddon } from "@xterm/addon-image"
import { Terminal } from "@xterm/xterm"

const terminal = new Terminal()
const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)
terminal.loadAddon(new ImageAddon())
terminal.open(document.getElementById("app")!)
fitAddon.fit()
terminal.input("")
terminal.onData((data) => {
  if (data == "\r" || data === "\n") {
    terminal.write("\n\r")
  } else {
    terminal.write(data)
  }
})
