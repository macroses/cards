<script setup lang="ts">
import type { ExerciseTemplate } from '~/ts'

defineProps<{
  exercise: ExerciseTemplate | null
}>()

function getExternalVideoLink(exerciseName: string) {
  return `https://www.youtube.com/results?search_query=${exerciseName.split(' ').join('+')}`
}
</script>

<template>
  <div class="exercise-details">
    <h2
      v-if="exercise"
      class="exercise-details__title"
    >
      <TheIcon
        v-tooltip="{
          content: exercise.equipment,
          position: 'bottom',
        }"
        width="35"
        :icon-name="exercise.equipment"
      />
      {{ exercise?.name }}
    </h2>

    <dl
      v-if="exercise"
      class="exercise-details__list"
    >
      <div>
        <dt>{{ $t('workout.details.main') }}</dt>
        <dd>{{ exercise.primary }}</dd>
      </div>
      <div v-if="exercise.secondary?.length">
        <dt>{{ $t('workout.details.secondary') }}</dt>
        <dd>{{ exercise.secondary.join(', ') }}</dd>
      </div>
      <div>
        <dt>{{ $t('workout.details.type') }}</dt>
        <dd>{{ exercise.category }}</dd>
      </div>
      <div>
        <dt>{{ $t('workout.details.level') }}</dt>
        <dd>{{ exercise.level }}</dd>
      </div>
      <div>
        <dt>{{ $t('workout.details.equipment') }}</dt>
        <dd>
          <TheIcon
            v-tooltip="exercise.equipment"
            width="25"
            :icon-name="exercise.equipment"
          />
        </dd>
      </div>
    </dl>
    <NuxtLink
      v-if="exercise?.description"
      :to="getExternalVideoLink(exercise.name)"
      target="_blank"
      no-rel
      class="exercise-details__link"
    >
      <TheIcon
        icon-name="arrow-up-right-from-square"
        width="20"
      />
      {{ exercise.description }}

      <span class="exercise-details__link-layer">
        <TheIcon
          icon-name="youtube"
          width="45"
        />
      </span>
    </NuxtLink>
  </div>
</template>

<!-- <style src='./style.css' /> -->
