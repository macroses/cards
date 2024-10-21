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
        document.execCommand(rule.command, false)
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
      document.execCommand('insertText', false, text)
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
