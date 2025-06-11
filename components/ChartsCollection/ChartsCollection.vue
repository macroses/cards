<script setup lang="ts">
import type { ChartsCollectionProps } from '~/ts/interfaces'

const props = defineProps<ChartsCollectionProps>()

const emit = defineEmits<{
  (event: 'update:selectedExercise', exerciseId: string): void
  (event: 'chartRemoved', chartId: number): void
  (event: 'chartDate', chartDate: string): void
}>()

const {
  collectedCharts,
  activeTabIndex,
  transitionName,
  removeChart,
  selectTab,
  handleExerciseSelect,
} = useChartsCollection(props, emit)

function handleChartClick(chartDate: string) {
  emit('chartDate', chartDate)
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
        :key="chart.id"
        class="charts-collection__tab"
        :class="{
          'button--secondary': activeTabIndex !== index,
          'button': collectedCharts.length > 1,
        }"
        @click="selectTab(index)"
      >
        {{ $t(chart.title) }}
        <TheIcon
          v-if="index !== 0"
          icon-name="xmark"
          width="18"
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
                @click="handleChartClick($event.name)"
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
            @click="handleChartClick($event.name)"
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
