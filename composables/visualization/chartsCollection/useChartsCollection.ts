import type { ChartsCollectionProps, CollectedChart } from '~/ts/interfaces'
import { ref, watch } from 'vue'

export function useChartsCollection(props: ChartsCollectionProps, emit: {
  (e: 'update:selectedExercise', exerciseId: string): void
  (e: 'chartRemoved', chartId: number): void
}) {
  const collectedCharts = ref<CollectedChart[]>([])
  const activeTabIndex = shallowRef<number>(0)
  const transitionName = shallowRef<'slideChart' | 'slideChartRight'>('slideChartRight')
  const transitionTimer = shallowRef<number | null>(null)

  function updateCollectedCharts() {
    collectedCharts.value = props.collectedChartIds
      .filter(id => id < props.charts.length)
      .map(id => ({
        ...props.charts[id],
        id,
      }))
  }

  watch([
    () => props.collectedChartIds,
    () => props.charts,
  ], () => {
    updateCollectedCharts()
  }, { immediate: true, deep: true })

  async function removeChart(index: number) {
    if (index === 0) {
      return
    }

    const chartId = collectedCharts.value[index].id

    if (activeTabIndex.value === index) {
      transitionName.value = 'slideChart'
      activeTabIndex.value = 0
    }
    else if (activeTabIndex.value > index) {
      activeTabIndex.value -= 1
    }

    if (transitionTimer.value !== null) {
      clearTimeout(transitionTimer.value)
      transitionTimer.value = null
    }

    try {
      await document.startViewTransition(async () => {
        // delay for Safari
        await new Promise((resolve) => {
          transitionTimer.value = setTimeout(resolve, 0) as unknown as number
        })
        emit('chartRemoved', chartId)
      }).finished
    }
    catch (error) {
      console.error('View transition error:', error)
      emit('chartRemoved', chartId)
    }
  }

  function selectTab(index: number): void {
    transitionName.value = index > activeTabIndex.value ? 'slideChartRight' : 'slideChart'
    activeTabIndex.value = index
  }

  function handleExerciseSelect(exerciseId: string): void {
    emit('update:selectedExercise', exerciseId)
  }

  return {
    collectedCharts,
    activeTabIndex,
    transitionName,
    removeChart,
    selectTab,
    handleExerciseSelect,
  }
}
