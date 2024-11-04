export default function (event: KeyboardEvent): void {
  const key: string = event.key

  const allowedKeys = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
  ]

  if (!allowedKeys.includes(key)) {
    event.preventDefault()
  }
}
