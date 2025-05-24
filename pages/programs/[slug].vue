<script setup lang="ts">
import type { ExerciseServerTemplate } from '~/ts/interfaces'

definePageMeta({
  validate(to) {
    return ['linear', 'undulating', 'block'].includes(to.params?.slug as string)
  },
})

const { exercisesList } = useFetchExercisesList()

// коллекция упражнений для программы, выбранная пользователем
const programExercisesCollection = ref<ExerciseServerTemplate[]>([])

function handleSelectExercise(exercise: ExerciseServerTemplate) {
  if (programExercisesCollection.value.some(({ id }) => id === exercise.id)) {
    return
  }

  programExercisesCollection.value.push(exercise)
}

function handleRemoveExercise(exerciseId: string) {
  programExercisesCollection.value = programExercisesCollection.value.filter(({ id }) => id !== exerciseId)
}
</script>

<template>
  <div class="program">
    <div class="program__settings">
      <div class="program__settings-form">
        <TheInputDropdown
          :items="exercisesList"
          placeholder="Выбор убражнений"
          @select-item="handleSelectExercise"
        />

        <ProgramExercisesList
          :exercises="programExercisesCollection"
          @remove-exercise="handleRemoveExercise"
        />

        <ProgramMainSettings />
      </div>
      <div class="program__settings-chart">
        <v-chart />
      </div>
    </div>
  </div>
</template>
