import type { EditingState, UserTrainingSession } from '~/ts/interfaces'

/**
 * Composable for managing the editing state of workout sets.
 * Handles input focus, refs, and editing interactions for weight and repeats fields.
 */

interface Focusable {
  focus: () => void
}

export function useEditingSetState() {
  const editingState = ref<EditingState>({
    setId: null,
    field: null,
  })

  const inputRefs = ref<Record<string, Focusable>>({})

  function handleEdit(setId: string, field: 'weight' | 'repeats') {
    editingState.value = { setId, field }

    nextTick(() => {
      if (inputRefs.value[setId]) {
        inputRefs.value[setId]?.focus()
      }
    }).then()
  }

  function handleInputSubmit() {
    if (editingState.value.setId && editingState.value.field) {
      editingState.value = { setId: null, field: null }
    }
  }

  function setInputRef(setId: string): (el: Focusable) => void {
    return (el) => {
      if (el) {
        inputRefs.value[setId] = el
      }
    }
  }

  function handleInputChange(
    event: Event,
    set: UserTrainingSession,
    field: 'weight' | 'repeats',
  ) {
    if (!(event.target as HTMLInputElement).value) {
      set[field] = 0
    }
  }

  return {
    editingState,
    inputRefs,
    handleEdit,
    handleInputSubmit,
    setInputRef,
    handleInputChange,
  }
}
