<script setup lang="ts">
import type { IWorkout } from '~/types/GetWorkoutsResponse'

interface Props {
  workout: IWorkout
  isCopyMode: boolean
}

withDefaults(defineProps<Props>(), {
  isCopyMode: false,
})

const emit = defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
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
    <TheButton>Поменять дату</TheButton>
  </div>
</template>
