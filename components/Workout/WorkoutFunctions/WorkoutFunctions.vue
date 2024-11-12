<script setup lang="ts">
import type { WorkoutFunctionsProps } from '~/ts/componentProps'

withDefaults(defineProps<WorkoutFunctionsProps>(), {
  isCopyMode: false,
  isDateChangeMode: false,
})

const emit = defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
  (event: 'changeDateMode'): void
}>()

const { locale } = useI18n()
</script>

<template>
  <div class="date-menu">
    <p class="date-menu__event-name">
      {{ workout?.title }}
    </p>
    <NuxtLink :to="`${locale}/workout/run/${workout.id}`">
      Перейти в тренировку
    </NuxtLink>
    <TheButton @click="emit('deleteWorkout')">
      Удалить
    </TheButton>
    <TheButton @click="emit('copyWorkout')">
      {{ isCopyMode ? 'Отменить копирование' : 'Копировать' }}
    </TheButton>
    <TheButton>Изменить</TheButton>
    <TheButton @click="emit('changeDateMode')">
      {{ isDateChangeMode ? 'Отменить изменение даты' : 'Поменять дату' }}
    </TheButton>
  </div>
</template>
