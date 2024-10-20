import { TEXT_EDITOR_RULES } from '~/constants/cards'

export function useCardEditing(
  formRef?: Ref<HTMLFormElement | null>,
  newCard?: Ref<{ question: string, answer: string }>,
  isQuestionValid?: Ref<boolean>,
  isAnswerValid?: Ref<boolean>,
  handleCreateCard?: () => void,
) {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      const rule = TEXT_EDITOR_RULES.find(rule => rule.key === event.key)

      if (rule) {
        event.preventDefault()

        const selection = window.getSelection()

        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const newNode = document.createElement(rule.tag)

          range.surroundContents(newNode)
          selection.removeAllRanges()
          selection.addRange(range)
        }

        return
      }
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      const questionInput = formRef?.value?.querySelector('[aria-label="question"]') as HTMLElement
      const answerInput = formRef?.value?.querySelector('[aria-label="answer"]') as HTMLElement

      if (!newCard?.value.question.trim()) {
        questionInput?.focus()
      }
      else if (!newCard?.value.answer.trim()) {
        answerInput?.focus()
      }
      else if (isQuestionValid?.value && isAnswerValid?.value) {
        handleCreateCard?.()
      }
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const text = event.clipboardData?.getData('text/plain')

    if (text) {
      const normalizedText = trimAndNormalizeSpaces(text)
      const selection = window.getSelection()

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        range.deleteContents()
        range.insertNode(document.createTextNode(normalizedText))
        selection.collapseToEnd()

        // диспатчим событие input, чтобы была реакция на изменение текста
        const inputEvent = new Event('input', {
          bubbles: true,
          cancelable: true,
        })
        event.target?.dispatchEvent(inputEvent)
      }
    }
  }

  function trimAndNormalizeSpaces(text: string): string {
    let trimmed = text.trim()

    // Заменяем множественные пробелы на один
    trimmed = trimmed.replace(/\s+/g, ' ')

    // Удаляем пустые теги
    trimmed = trimmed.replace(/<([a-z]+)>\s*<\/\1>/gi, '')

    // Удаляем новые пустые строки
    trimmed = trimmed.replace(/(\r\n|\n|\r)/g, '')

    let prevLength

    do {
      prevLength = trimmed.length
      trimmed = trimmed.replace(/<([a-z]+)>\s*<\/\1>/gi, '')
    } while (trimmed.length !== prevLength)

    return trimmed
  }

  return {
    handleKeyDown,
    handlePaste,
    trimAndNormalizeSpaces,
  }
}
