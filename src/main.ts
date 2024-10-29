import "@xterm/xterm/css/xterm.css"
import { FitAddon } from "@xterm/addon-fit"
import { ImageAddon } from "@xterm/addon-image"
import { Terminal } from "@xterm/xterm"
import { io } from "socket.io-client"

enum InputMode {
  LINE = "Line",
  LINE_EXCEPT_SPECIAL = "LineExceptSpecial",
  CHAR = "Char"
}

const terminal = new Terminal()
const fitAddon = new FitAddon()
terminal.loadAddon(fitAddon)
terminal.loadAddon(new ImageAddon())
terminal.open(document.getElementById("app")!)
fitAddon.fit()
terminal.input("")
let inputMode = InputMode.LINE
let input = ""
let specialChars: string[] = []
terminal.onData((char) => {
  if (inputMode === InputMode.LINE || inputMode === InputMode.LINE_EXCEPT_SPECIAL) {
    if (char == "\r" || char === "\n") {
      terminal.write("\n\r")
      socket.emit("input-line", input)
      input = ""
    } else {
      //@ts-ignore
      if (inputMode === InputMode.LINE_EXCEPT_SPECIAL && specialChars.includes(char)) {
        socket.emit("input", char)
      } else {
        input += char
        terminal.write(char)
      }
    }
  } else if (inputMode === InputMode.CHAR) {
    socket.emit("input", char)
  }
})
terminal.onResize((size) => {
  socket.emit("resize", size)
})

const socket = io()
socket.on("print", (data) => {
  input = ""
  terminal.write(data)
})
socket.on("connect", () => {
  socket.emit("resize", { cols: terminal.cols, rows: terminal.rows })
})
socket.on("resize", (size: { cols: number; rows: number }) => {
  terminal.resize(size.cols, size.rows)
})
socket.on("clear", () => {
  terminal.clear()
})
socket.on("set-input-mode", (data: { mode: InputMode; specialChars?: string[] }) => {
  inputMode = data.mode
  specialChars = data.specialChars ?? []
})
socket.connect()
