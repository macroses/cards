import type { ExercisesListProps } from '~/ts/componentProps'
import type { ExerciseServerTemplate } from '~/ts/interfaces'
import { useGetExercisesList } from './useGetExercisesList'

export function useExercisesList({ selectedExercises, emit }: ExercisesListProps) {
  const { exercisesList } = useGetExercisesList()

  const activeGroupId = ref<string | null>(null)
  const modalRef = ref<any>(null)
  const selectedExerciseForModal = ref<ExerciseServerTemplate | null>(null)

  function toggleGroup(groupId: string) {
    activeGroupId.value = activeGroupId.value === groupId ? null : groupId
  }

  function isExerciseSelected(exercise: ExerciseServerTemplate) {
    return selectedExercises.some(selected => selected.id === exercise.id)
  }

  function openModal(exercise: ExerciseServerTemplate) {
    selectedExerciseForModal.value = exercise
    modalRef.value?.openModal()
  }

  function closeModal() {
    if (selectedExerciseForModal.value) {
      emit('selectExercise', selectedExerciseForModal.value)
    }

    selectedExerciseForModal.value = null
    modalRef.value?.closeModal()
  }

  return {
    exercisesList,
    activeGroupId,
    modalRef,
    selectedExerciseForModal,
    toggleGroup,
    isExerciseSelected,
    openModal,
    closeModal,
  }
}
