<script setup lang="ts">
import type { Statistics } from '~/ts/interfaces'

defineProps<{
  statistics: Statistics | null
}>()
</script>

<template>
  <div class="global-statistics">
    <h3 class="global-statistics__title">
      {{ $t('statistics.global_title') }}
    </h3>

    <ul
      v-if="statistics"
      class="global-statistics__grid"
    >
      <li class="statistic-item">
        <div class="statistic-item__label">
          {{ $t('statistics.max_tonnage') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.maxTonnage }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          {{ $t('statistics.total_tonnage') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.totalTonnage }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          {{ $t('statistics.avg_duration') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.avgWorkoutDuration }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          {{ $t('statistics.avg_set_time') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.avgSetTime }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          {{ $t('statistics.completed_workouts') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.completedWorkouts }}/{{ statistics.totalWorkouts }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped src="./style.css" />
