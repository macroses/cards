export function useCardEditing(
  formRef?: Ref<HTMLFormElement | null>,
  newCard?: Ref<{ question: string, answer: string }>,
  isQuestionValid?: Ref<boolean>,
  isAnswerValid?: Ref<boolean>,
  handleCreateCard?: () => void,
) {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      if (event.key === 'b') {
        event.preventDefault()
        document.execCommand('bold', false)
      }
      else if (event.key === 'i') {
        event.preventDefault()
        document.execCommand('italic', false)
      }
      else if (event.key === 'u') {
        event.preventDefault()
        document.execCommand('underline', false)
      }
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      if (!isQuestionValid?.value) {
        (formRef?.value?.querySelector('[aria-label="Термин"]') as HTMLElement)?.focus()
      }
      else if (!isAnswerValid?.value) {
        (formRef?.value?.querySelector('[aria-label="Определение"]') as HTMLElement)?.focus()
      }
      else if (isQuestionValid.value && isAnswerValid.value) {
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
    return text.trim().replace(/\s+/g, ' ')
  }

  return {
    handleKeyDown,
    handlePaste,
    trimAndNormalizeSpaces,
  }
}
