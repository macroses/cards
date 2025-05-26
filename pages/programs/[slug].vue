<script setup lang="ts">
import type { ExerciseServerTemplate } from '~/ts/interfaces'

definePageMeta({
  validate(to) {
    return ['linear', 'undulating', 'block'].includes(to.params?.slug as string)
  },
})

const { exercisesList } = useFetchExercisesList()
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
        <ProgramMainSettings />
        <ProgramExercisesList
          :exercises="programExercisesCollection"
          @remove-exercise="handleRemoveExercise"
        />
      </div>
      <div class="program__settings-chart">
        <!--        <v-chart -->
        <!--          v-if="chartOption" -->
        <!--          class="program-chart" -->
        <!--          :option="chartOption" -->
        <!--          autoresize -->
        <!--          style="min-height: 300px" -->
        <!--        /> -->
      </div>
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
