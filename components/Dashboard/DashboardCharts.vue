<script setup lang="ts">
import ChartsCollection from '../ChartsCollection/ChartsCollection.vue'

const {
  charts,
  selectedExercise,
  popularExercises,
  getExerciseName,
  isLoading,
  refresh,
} = useGlobalCharts()

onMounted(async () => {
  if (isLoading.value || !charts.value[0]?.option) {
    await refresh()
  }

  validateCollectedCharts()
})

const CHARTS_COLLECTION_KEY = 'dashboard-charts-collection'

const collectedChartIds = useLocalStorage(CHARTS_COLLECTION_KEY, [0])

function validateCollectedCharts() {
  const validIds = collectedChartIds.value.filter(id => id < charts.value.length)

  if (!validIds.includes(0)) {
    validIds.unshift(0)
  }

  collectedChartIds.value = validIds
}

watch(() => charts.value.length, validateCollectedCharts)

const availableCharts = computed(() => {
  return charts.value.filter((_, index) => !collectedChartIds.value.includes(index))
})

function addChart(chartId: number) {
  if (!collectedChartIds.value.includes(chartId)) {
    collectedChartIds.value.push(chartId)
  }
}

function onChartRemoved(chartId: number) {
  const index = collectedChartIds.value.indexOf(chartId)

  if (index > 0) {
    collectedChartIds.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="dashboard-charts__list">
    <ChartsCollection
      v-model:selected-exercise="selectedExercise"
      :charts="charts"
      :popular-exercises="popularExercises"
      :get-exercise-name="getExerciseName"
      :collected-chart-ids="collectedChartIds"
      :is-loading="isLoading"
      @chart-removed="onChartRemoved"
    />

    <div v-if="availableCharts.length > 0" class="available-charts">
      <div
        v-for="(chart, index) in availableCharts"
        :key="index"
        class="chart-container clickable"
        @click="addChart(charts.indexOf(chart))"
      >
        <h3 class="chart-container__title">
          {{ $t(chart.title) }}
          <span class="add-icon">
            <TheIcon
              icon-name="plus"
              width="14px"
            />
          </span>
        </h3>

        <template v-if="chart.type === 'exercise'">
          <div class="exercise-chart-container">
            <div class="exercise-list">
              <TheButton
                v-for="exerciseId in popularExercises"
                :key="exerciseId"
                :variant="selectedExercise === exerciseId ? 'primary' : 'secondary'"
                @click.stop="selectedExercise = exerciseId"
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
  </div>
</template>

<style src="./style.css" />

<style scoped>
.chart {
  height: 300px;
  width: 100%;
}
</style>
