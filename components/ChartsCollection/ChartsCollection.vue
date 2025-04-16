<script setup lang="ts">
import type { ChartsCollectionProps, CollectedChart } from '~/ts/interfaces/dashboardCharts.interface'

const props = defineProps<ChartsCollectionProps>()

const emit = defineEmits<{
  'update:selectedExercise': [exerciseId: string]
  'chartRemoved': [chartId: number]
}>()

const collectedCharts = ref<CollectedChart[]>([])
const activeTabIndex = ref<number>(0)

function updateCollectedCharts() {
  collectedCharts.value = props.collectedChartIds
    .filter(id => id < props.charts.length)
    .map(id => ({
      ...props.charts[id],
      id,
    }))
}

watch(() => props.collectedChartIds, updateCollectedCharts, { immediate: true, deep: true })
watch(() => props.charts, updateCollectedCharts, { immediate: true, deep: true })

function removeChart(index: number) {
  if (index === 0) {
    return
  }

  const chartId = collectedCharts.value[index].id

  collectedCharts.value.splice(index, 1)

  if (activeTabIndex.value >= collectedCharts.value.length) {
    activeTabIndex.value = collectedCharts.value.length - 1
  }

  if (activeTabIndex.value < 0) {
    activeTabIndex.value = 0
  }

  emit('chartRemoved', chartId)
}

function selectTab(index: number): void {
  activeTabIndex.value = index
}

function handleExerciseSelect(exerciseId: string): void {
  emit('update:selectedExercise', exerciseId)
}
</script>

<template>
  <div class="charts-collection" @click.stop>
    <div class="charts-collection__tabs">
      <div
        v-for="(chart, index) in collectedCharts"
        :key="index"
        class="charts-collection__tab"
        :class="{
          'charts-collection__tab--active': activeTabIndex === index,
        }"
        @click="selectTab(index)"
      >
        {{ $t(chart.title) }}
        <TheIcon
          v-if="index !== 0"
          icon-name="xmark"
          width="12px"
          class="tab-close-icon"
          @click.stop="removeChart(index)"
        />
      </div>
    </div>

    <div class="charts-collection__content">
      <template v-if="activeTabIndex < collectedCharts.length">
        <div class="chart-container">
          <template v-if="collectedCharts[activeTabIndex].type === 'exercise'">
            <div class="exercise-chart-container">
              <div class="exercise-list">
                <TheButton
                  v-for="exerciseId in popularExercises"
                  :key="exerciseId"
                  :variant="selectedExercise === exerciseId ? 'primary' : 'secondary'"
                  @click="handleExerciseSelect(exerciseId)"
                >
                  {{ getExerciseName(exerciseId) }}
                </TheButton>
              </div>
              <v-chart
                v-if="collectedCharts[activeTabIndex].option"
                class="chart"
                :option="collectedCharts[activeTabIndex].option || undefined"
                autoresize
              />
              <div v-else class="chart-placeholder">
                <p>Данные графика недоступны</p>
              </div>
            </div>
          </template>

          <v-chart
            v-else-if="collectedCharts[activeTabIndex].option"
            class="chart"
            :option="collectedCharts[activeTabIndex].option || undefined"
            autoresize
          />
          <div v-else class="chart-placeholder">
            <p>Данные графика недоступны</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped src="./style.css" />
