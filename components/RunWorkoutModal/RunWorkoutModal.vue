<script setup lang="ts">
import { TheButton, TheModal } from '#components'
import { ref } from 'vue'

const emit = defineEmits<{
  (event: 'startWorkout'): void
  (event: 'close'): void
}>()

const modal = ref<InstanceType<typeof TheModal> | null>(null)

function openModal() {
  modal.value?.openModal()
}

function closeModal() {
  if (modal.value) {
    modal.value.closeModal()
    emit('close')
  }
}

defineExpose({
  openModal,
})
</script>

<template>
  <TheModal
    ref="modal"
    :is-outside-close="false"
    :has-close-button="false"
    class="date-menu__start-workout"
  >
    <template #content>
      <div class="date-menu__start-content">
        <div class="date-menu__start-text">
          <p>Вы приступите к выполнению тренировки.</p>
          <p>Это следует делать, <b>если вы готовы начать прямо сейчас</b></p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="date-menu__start-footer">
        <TheButton
          variant="ghost"
          @click="closeModal"
        >
          отменить
        </TheButton>
        <TheButton
          @click="emit('startWorkout')"
        >
          начать
        </TheButton>
      </div>
    </template>
  </TheModal>
</template>
