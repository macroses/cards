<script setup lang="ts">
import type { ExerciseTemplate } from '~/ts'

definePageMeta({
  validate(to) {
    return ['linear', 'undulating', 'block'].includes(to.params?.slug as string)
  },
})

const { exercisesList } = useFetchExercisesList()

// коллекция упражнений для программы, выбранная пользователем
const programExercisesCollection = ref<ExerciseTemplate[]>([])

function handleSelectExercise(exercise: ExerciseTemplate) {
  if (programExercisesCollection.value.some(({ id }) => id === exercise.id)) {
    return
  }

  programExercisesCollection.value.push(exercise)
}

function handleRemoveExercise(exerciseId: string) {
  programExercisesCollection.value = programExercisesCollection.value.filter(({ id }) => id !== exerciseId)
}

function getSettings() {

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
        <ProgramMainSettings
          @update:settings="getSettings"
        />
        <ProgramExercisesList
          :exercises="programExercisesCollection"
          @remove-exercise="handleRemoveExercise"
        />
      </div>
      <div class="program__settings-chart" />
    </div>
  </div>
</template>

<style scoped>
.program-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
