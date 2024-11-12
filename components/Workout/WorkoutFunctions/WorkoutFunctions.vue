<script setup lang="ts">
import type { WorkoutFunctionsProps } from '~/ts/componentProps'

const props = withDefaults(defineProps<WorkoutFunctionsProps>(), {
  isCopyMode: false,
  isDateChangeMode: false,
})

const emit = defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
  (event: 'changeDateMode'): void
}>()

const localePath = useLocalePath()

function toWorkout() {
  navigateTo(localePath(`/workout/run/${props.workout.id}`))
}
</script>

<template>
  <div
    class="date-menu"
    @click="toWorkout"
  >
    <div class="date-menu__event-name">
      {{ workout?.title }}
    </div>

    <TheButton @click.stop="emit('deleteWorkout')">
      Удалить
    </TheButton>
    <TheButton @click.stop="emit('copyWorkout')">
      {{ isCopyMode ? 'Отменить копирование' : 'Копировать' }}
    </TheButton>
    <TheButton>Изменить</TheButton>
    <TheButton @click="emit('changeDateMode')">
      {{ isDateChangeMode ? 'Отменить изменение даты' : 'Поменять дату' }}
    </TheButton>
  </div>
</template>
