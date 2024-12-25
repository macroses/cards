import type { EditingState } from '~/ts/interfaces'

export function useEditingSetState() {
  const editingState = ref<EditingState>({
    setId: null,
    field: null,
  })

  const inputRefs = ref<Record<string, any>>({})

  function handleEdit(setId: string, field: 'weight' | 'repeats') {
    editingState.value = { setId, field }

    nextTick(() => {
      if (inputRefs.value[setId]) {
        inputRefs.value[setId]?.focus()
      }
    })
  }

  function handleInputSubmit() {
    if (editingState.value.setId && editingState.value.field) {
      editingState.value = { setId: null, field: null }
    }
  }

  function setInputRef(setId: string): (el: any) => void {
    return (el) => {
      if (el) {
        inputRefs.value[setId] = el
      }
    }
  }

  function handleInputChange(event: Event, set: any, field: 'weight' | 'repeats') {
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
