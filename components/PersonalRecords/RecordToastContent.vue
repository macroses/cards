<script setup lang="ts">
import type { NewRecord, RecordType } from '~/ts/types/personalRecords.types'

const props = defineProps<{
  records: NewRecord[]
}>()

interface GroupedRecord {
  exerciseId: string
  exerciseName: string
  records: NewRecord[]
}

const recordTypeText: Record<RecordType, string> = {
  weight: 'Вес, кг',
  volume: 'Объем, тонн',
}

const groupedRecords = computed<GroupedRecord[]>(() =>
  Object.values(
    props.records.reduce((groups, record) => ({
      ...groups,
      [record.exerciseId]: {
        exerciseId: record.exerciseId,
        exerciseName: record.exerciseName,
        records: [...(groups[record.exerciseId]?.records || []), record],
      },
    }), {} as Record<string, GroupedRecord>),
  ),
)
</script>

<template>
  <div class="record-toast-content">
    <div class="notification-header">
      <h3>
        <TheIcon
          icon-name="trophy-star"
          width="20px"
        />
        Новые личные рекорды!
      </h3>
    </div>
    <dl class="records-list">
      <template
        v-for="group in groupedRecords"
        :key="group.exerciseId"
      >
        <dt class="record-exercise-title">
          {{ group.exerciseName }}
        </dt>
        <dd class="record-details-list">
          <dl
            v-for="record in group.records"
            :key="`${record.exerciseId}-${record.type}`"
            class="record-detail-item"
          >
            <dt
              v-if="recordTypeText[record.type]"
              class="record-type"
            >
              {{ recordTypeText[record.type] }}
            </dt>
            <dd class="record-value">
              <del class="record-value__previous">{{ record.previousValue }}</del>
              <span class="record-value__arrow" />
              <span class="record-value__current">
                <TheIcon
                  icon-name="fire"
                  width="18px"
                  class="record-value__icon"
                />
                {{ record.value }}
              </span>
            </dd>
          </dl>
        </dd>
      </template>
    </dl>
  </div>
</template>

<style src="./style.css" />
