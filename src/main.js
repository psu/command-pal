import App from "./App.svelte"
import pubsub from "micro-pubsub"

class CommandPal {
  constructor(options) {
    if (options.debugOutput) {
      console.log("CommandPal", { options })
    }
    this.options = options || {}
    this.ps = pubsub.create()
    this.symbolMapping = {
      ctrl: "⌃",
      shift: "⇧",
      command: "⌘",
      cmd: "⌘",
      option: "⌥",
      alt: "⌥",
      space: "⎵",
      capslock: "⇪",
      return: "↩︎",
      enter: "↩︎",
      esc: "⎋",
      escape: "⎋",
      backspace: "⌫",
      delete: "⌦",
      del: "⌦",
      tab: "⇥",
      clear: "",
      up: "↑",
      down: "↓",
      left: "←",
      right: "→",
      home: "⇱",
      end: "⇲",
      pageup: "⇞",
      pagedown: "⇟",
      num_enter: "⌅",
    }
  }

  start() {
    this.app = new App({
      target: document.body,
      props: {
        hotkey: this.options.hotkey || "ctrl+space",
        hotkey: this.options.hotkey || "ctrl+space",
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        inputData: this.options.commands || [],
        paletteId: this.options.id || "CommandPal",
        placeholderText: this.options.placeholder || "What are you looking for?",
        hotkeysGlobal: this.options.hotkeysGlobal || false,
        hideButton: this.options.hideButton || false,
        emptyResultText: this.options.emptyResultText || "No matching commands…",
        displayShortcutSymbols: this.options.displayShortcutSymbols || false,
        symbolMapping: this.symbolMapping,
        shortcutOpenPalette: typeof this.options.shortcutOpenPalette === "undefined"? true: this.options.shortcutOpenPalette,
      },
    })
    const ctx = this
    function subTo(eventName) {
      ctx.app.$on(eventName, e => ctx.ps.publish(eventName, e.detail))
    }
    subTo("opened")
    subTo("closed")
    subTo("textChanged")
    subTo("exec")
    this.ps.subscribe("exec", item => {
      if (item.handler && typeof item.handler === "function") {
        item.handler()
      }
    })
  }

  subscribe(eventName, cb) {
    this.ps.subscribe(eventName, e => cb(e))
  }

  destroy() {
    this.app.$destroy()
  }
}

export default CommandPal
window.CommandPal = CommandPal
