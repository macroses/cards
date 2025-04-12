<script setup lang="ts">
import type { NewRecord, RecordType } from '~/ts/types/personalRecords.types'

defineProps<{
  records: NewRecord[]
  visible: boolean
}>()

defineEmits<{
  (event: 'close'): void
}>()

const recordTypeText: Record<RecordType, string> = {
  weight: 'по весу',
  repeats: 'по повторениям',
  volume: 'по объему',
}

function getRecordText(record: NewRecord): string {
  switch (record.type) {
    case 'weight':
      return `${record.value} кг (предыдущий: ${record.previousValue} кг)`
    case 'repeats':
      return `${record.value} повторений (предыдущий: ${record.previousValue})`
    case 'volume':
      return `${record.value} кг (предыдущий: ${record.previousValue} кг)`
    default:
      return ''
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible && records.length > 0"
      class="personal-record-notification"
    >
      <div class="notification-header">
        <h3>🏆 Новые личные рекорды!</h3>
        <button
          class="close-button"
          @click="$emit('close')"
        >
          <TheIcon
            icon-name="xmark"
            width="18px"
          />
        </button>
      </div>
      <ul class="records-list">
        <li
          v-for="record in records"
          :key="`${record.exerciseId}-${record.type}`"
          class="record-item"
        >
          <div class="record-exercise">
            {{ record.exerciseName }}
          </div>
          <div class="record-type">
            Новый рекорд {{ recordTypeText[record.type] }}
          </div>
          <div class="record-value">
            {{ getRecordText(record) }}
          </div>
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style src="./style.css" />
