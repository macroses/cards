<script setup lang="ts">
import type { ChartsCollectionProps, CollectedChart } from '~/ts/interfaces/dashboardCharts.interface'

const props = defineProps<ChartsCollectionProps>()

const emit = defineEmits<{
  'update:selectedExercise': [exerciseId: string]
  'chartRemoved': [chartId: number]
}>()

const collectedCharts = ref<CollectedChart[]>([])
const activeTabIndex = ref<number>(0)
const transitionName = ref<'slideChart' | 'slideChartRight'>('slideChartRight')

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

async function removeChart(index: number) {
  if (index === 0) {
    return
  }

  const chartId = collectedCharts.value[index].id

  if (activeTabIndex.value === index) {
    // When removing the active tab, transition to the first tab
    transitionName.value = 'slideChart'
    activeTabIndex.value = 0
  }
  else if (activeTabIndex.value > index) {
    // When removing a tab before the active tab, adjust index but don't animate
    activeTabIndex.value -= 1
  }

  emit('chartRemoved', chartId)

  if (!document.startViewTransition) {
    return
  }

  return document.startViewTransition().finished
}

function selectTab(index: number): void {
  // Set transition direction based on index change
  transitionName.value = index > activeTabIndex.value ? 'slideChartRight' : 'slideChart'
  activeTabIndex.value = index
}

function handleExerciseSelect(exerciseId: string): void {
  emit('update:selectedExercise', exerciseId)
}
</script>

<template>
  <div class="charts-collection" @click.stop>
    <div
      class="charts-collection__tabs"
      :class="{ 'charts-collection__tabs--active': collectedCharts.length > 1 }"
    >
      <div
        v-for="(chart, index) in collectedCharts"
        :key="index"
        class="charts-collection__tab"
        :class="{
          'button--secondary': activeTabIndex !== index,
          'button': collectedCharts.length > 1,
        }"
        :style="{ '--chart-transition-name': `chart-${chart.id}` }"
        @click="selectTab(index)"
      >
        {{ $t(chart.title) }}
        <TheIcon
          v-if="index !== 0"
          icon-name="xmark"
          width="18px"
          class="tab-close-icon"
          @click.stop="removeChart(index)"
        />
      </div>
    </div>

    <div class="charts-collection__content">
      <Transition
        mode="out-in"
        :name="transitionName"
      >
        <div
          v-if="activeTabIndex < collectedCharts.length"
          :key="activeTabIndex"
          class="chart-container"
        >
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
      </Transition>
    </div>
  </div>
</template>

<style scoped src="./style.css" />
