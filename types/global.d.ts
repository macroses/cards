declare global {
  interface HTMLElement {
    _tooltip?: HTMLElement
    _showTimeout?: ReturnType<typeof setTimeout>
    _removeTooltip?: () => void
  }
}

export {}
