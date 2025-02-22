<script setup lang="ts">
const { statistics } = useGlobalStatistics()
</script>

<template>
  <div class="global-statistics">
    <h3 class="global-statistics__title">
      {{ $t('statistics.global_title') }}
    </h3>

    <div v-if="statistics" class="global-statistics__grid">
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.maxTonnage }}т
        </div>
        <div class="statistic-item__label">
          {{ $t('statistics.max_tonnage') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.totalTonnage }}т
        </div>
        <div class="statistic-item__label">
          {{ $t('statistics.total_tonnage') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.avgWorkoutDuration }}мин
        </div>
        <div class="statistic-item__label">
          {{ $t('statistics.avg_duration') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.avgSetTime }}сек
        </div>
        <div class="statistic-item__label">
          {{ $t('statistics.avg_set_time') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.completedWorkouts }}/{{ statistics.totalWorkouts }}
        </div>
        <div class="statistic-item__label">
          {{ $t('statistics.completed_workouts') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./style.css" />
