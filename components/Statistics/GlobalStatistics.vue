<script setup lang="ts">
const { statistics, isLoading, error } = useGlobalStatistics()
const { t } = useI18n()
</script>

<template>
  <div class="global-statistics">
    <h3 class="global-statistics__title">
      {{ t('statistics.global_title') }}
    </h3>

    <div v-if="isLoading" class="global-statistics__loading">
      {{ t('common.loading') }}
    </div>

    <div v-else-if="error" class="global-statistics__error">
      {{ error }}
    </div>

    <div v-else-if="statistics" class="global-statistics__grid">
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.maxTonnage }}т
        </div>
        <div class="statistic-item__label">
          {{ t('statistics.max_tonnage') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.totalTonnage }}т
        </div>
        <div class="statistic-item__label">
          {{ t('statistics.total_tonnage') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.avgWorkoutDuration }}мин
        </div>
        <div class="statistic-item__label">
          {{ t('statistics.avg_duration') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.avgSetTime }}сек
        </div>
        <div class="statistic-item__label">
          {{ t('statistics.avg_set_time') }}
        </div>
      </div>
      <div class="statistic-item">
        <div class="statistic-item__value">
          {{ statistics.completedWorkouts }}/{{ statistics.totalWorkouts }}
        </div>
        <div class="statistic-item__label">
          {{ t('statistics.completed_workouts') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.global-statistics {
  border: 1px solid rgb(var(--border-color));
  border-radius: 20px;
  padding: 16px;
  background-color: var(--main-bg);
}

.global-statistics__title {
  font-size: 16px;
  margin-bottom: 16px;
}

.global-statistics__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.statistic-item {
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  background-color: rgb(var(--accent-color) / 0.1);
}

.statistic-item__value {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
}

.statistic-item__label {
  font-size: 14px;
  color: rgb(var(--text-color) / 0.7);
}
</style>
