import type { EditingState } from '~/ts/interfaces'
import { useSetWeightAndRepeats } from './useSetWeightAndRepeats'

export function useEditingSetState() {
  const editingState = ref<EditingState>({
    setId: null,
    field: null,
    set: undefined,
  })

  const inputRefs = ref<Record<string, any>>({})
  const { updateSetWeightAndRepeats } = useSetWeightAndRepeats()

  function handleEdit(
    setId: string,
    field: EditingState['field'],
    set: EditingState['set'],
  ) {
    editingState.value = { setId, field, set }

    nextTick(() => {
      const input = inputRefs.value[setId]

      if (input) {
        input.focus()
      }
    }).then()
  }

  function resetEditingState() {
    editingState.value = { setId: null, field: null, set: undefined }
  }

  async function handleInputSubmit() {
    const { setId, set } = editingState.value

    if (setId && set) {
      await updateSetWeightAndRepeats(
        setId,
        set.weight,
        set.repeats,
      )

      resetEditingState()
    }
  }

  function setInputRef(setId: string): (el: any) => void {
    return el => el && (inputRefs.value[setId] = el)
  }

  function handleInputChange(
    event: Event,
    set: any,
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
