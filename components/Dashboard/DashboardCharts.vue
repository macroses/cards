<script setup lang="ts">
const {
  charts,
  selectedExercise,
  popularExercises,
  getExerciseName,
} = useGlobalCharts()

const activeTab = ref(0)
</script>

<template>
  <ContainerUI class="dashboard-charts__container">
    <div class="tabs-header">
      <button
        v-for="(chart, index) in charts"
        :key="index"
        class="tab-button"
        :class="{ 'tab-button--active': activeTab === index }"
        @click="activeTab = index"
      >
        {{ $t(chart.title) }}
      </button>
    </div>

    <div class="tabs-content">
      <div
        v-for="(chart, index) in charts"
        v-show="activeTab === index"
        :key="index"
        class="tab-panel"
      >
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
  </ContainerUI>
</template>

<style src="./style.css" />

<style scoped>
.dashboard-charts__container {
  width: 100%;
}

.tabs-header {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1rem;
  gap: 0.25rem;
}

.tab-button {
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s ease;
}

.tab-button--active {
  border-bottom-color: #3b82f6;
}

.tabs-content {
  min-height: 350px;
}

.chart {
  height: 300px;
  width: 100%;
}

.exercise-chart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-list {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
