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
  // add validating for added

  programExercisesCollection.value.push(exercise)
}

// function handleRemoveExercise(exerciseId: string) {
//   programExercisesCollection.value = programExercisesCollection.value.filter(exercise => exercise.id !== exerciseId)
// }
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

        <div class="program__settings-exercises">
          <ul class="program__settings-exercise-list">
            <li
              v-for="exercise in programExercisesCollection"
              :key="exercise.id"
              class="program__settings-exercise-item"
            >
              <div class="program__settings-exercise-name">
                {{ exercise.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="program__settings-chart" />
    </div>
  </div>
</template>
