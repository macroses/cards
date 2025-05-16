<script setup lang="ts">
import ChartsCollection from '../ChartsCollection/ChartsCollection.vue'

const emit = defineEmits<{
  (event: 'chartDate', chartDate: string): void
}>()

const {
  charts,
  selectedExercise,
  popularExercises,
  getExerciseName,
} = useGlobalCharts()

onMounted(() => {
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

async function addChartToCollection(chartId: number) {
  if (!document.startViewTransition) {
    collectedChartIds.value.push(chartId)
    return
  }

  await document.startViewTransition(() => {
    collectedChartIds.value.push(chartId)
  }).finished
}

async function onChartRemoved(chartId: number) {
  const index = collectedChartIds.value.indexOf(chartId)

  if (index !== -1 || !document.startViewTransition) {
    collectedChartIds.value.splice(index, 1)
    return
  }

  await document.startViewTransition(() => {
    collectedChartIds.value.splice(index, 1)
  }).finished
}

function handleChartClick(chartDate: string) {
  emit('chartDate', chartDate)
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
      @chart-removed="onChartRemoved"
      @chart-date="handleChartClick"
    />

    <div
      v-if="availableCharts.length > 0"
      class="available-charts"
    >
      <div
        v-for="chart in availableCharts"
        :key="chart.title"
        class="chart-container available clickable"
        :style="{
          '--chart-transition-name': `chart-${charts.indexOf(chart)}`,
        }"
      >
        <div class="chart-container__header">
          <h3 class="chart-container__title">
            {{ $t(chart.title) }}
          </h3>

          <TheButton
            v-tooltip="{ content: 'Add to collection', position: 'left' }"
            variant="secondary"
            icon-only
            @click.stop="addChartToCollection(charts.indexOf(chart))"
          >
            <TheIcon
              icon-name="merge"
              width="18"
              class="add-chart__icon"
            />
          </TheButton>
        </div>

        <template v-if="chart.type === 'exercise'">
          <div class="exercise-chart-container">
            <ul class="exercise-list">
              <li
                v-for="exerciseId in popularExercises"
                :key="exerciseId"
              >
                <TheButton
                  :variant="selectedExercise === exerciseId ? 'primary' : 'secondary'"
                  @click.stop="selectedExercise = exerciseId"
                >
                  {{ getExerciseName(exerciseId) }}
                </TheButton>
              </li>
            </ul>
            <v-chart
              v-if="chart.option"
              class="chart"
              :option="chart.option"
              autoresize
              @click="handleChartClick($event.name)"
            />
          </div>
        </template>

        <v-chart
          v-else-if="chart.option"
          class="chart"
          :option="chart.option"
          autoresize
          @click="handleChartClick($event.name)"
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
