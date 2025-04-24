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
          <div class="statistic-item__label-icon">
            <TheIcon
              icon-name="dumbbell"
              width="20"
            />
            <span>MAX</span>
          </div>
          {{ $t('statistics.max_tonnage') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.maxTonnage }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          <div class="statistic-item__label-icon">
            <TheIcon
              icon-name="weight-hanging"
              width="20"
            />
            <span>∑</span>
          </div>
          {{ $t('statistics.total_tonnage') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.totalTonnage }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          <div class="statistic-item__label-icon">
            <TheIcon
              icon-name="clock"
              width="20"
            />
            <span>AVG</span>
          </div>
          {{ $t('statistics.avg_duration') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.avgWorkoutDuration }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          <div class="statistic-item__label-icon">
            <TheIcon
              icon-name="clock"
              width="20"
            />
            <span>SET</span>
          </div>
          {{ $t('statistics.avg_set_time') }}
        </div>
        <div class="statistic-item__value">
          {{ statistics.avgSetTime }}
        </div>
      </li>
      <li class="statistic-item">
        <div class="statistic-item__label">
          <div class="statistic-item__label-icon">
            <TheIcon
              icon-name="list-check"
              width="20"
            />
            <!--            <span>SET</span> -->
          </div>
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
