<script setup lang="ts">
const {
  charts,
  selectedExercise,
  popularExercises,
  getExerciseName,
} = useGlobalCharts()
</script>

<template>
  <div class="dashboard-charts__list">
    <div
      v-for="(chart, index) in charts"
      :key="index"
      class="chart-container"
    >
      <h3 class="chart-container__title">
        {{ $t(chart.title) }}
      </h3>

      <template v-if="chart.type === 'exercise'">
        <div class="exercise-chart-container">
          <div class="exercise-list">
            <TheButton
              v-for="exerciseId in popularExercises"
              :key="exerciseId"
              :variant="selectedExercise === exerciseId ? 'primary' : 'secondary'"
              @click="selectedExercise = exerciseId"
            >
              {{ getExerciseName(exerciseId) }}
            </TheButton>
          </div>
          <v-chart
            v-if="chart.option"
            class="chart"
            :option="chart.option"
            autoresize
          />
        </div>
      </template>

      <v-chart
        v-else-if="chart.option"
        class="chart"
        :option="chart.option"
        autoresize
      />
    </div>
  </div>
</template>

<style src="./style.css" />

<style scoped>
.chart {
  height: 300px;
  width: 100%;
}
</style>
