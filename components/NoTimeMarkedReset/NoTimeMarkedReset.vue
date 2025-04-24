<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'

const emit = defineEmits<{
  (event: 'resetNoTimeWorkout'): void
}>()

const modalRef = useTemplateRef<InstanceType<typeof TheModal>>('modalRef')

defineExpose({
  openModal: () => modalRef.value?.openModal(),
  closeModal: () => modalRef.value?.closeModal(),
})
</script>

<template>
  <TheModal
    ref="modalRef"
    class="no-time-modal"
  >
    <template #title>
      <h3>
        <TheIcon
          icon-name="triangle-exclamation"
          width="24"
          class="warning-icon"
        />
        {{ $t('workout.no_time_warning') }}
      </h3>
    </template>
    <template #content>
      <p>{{ $t('workout.no_time_description') }}</p>
    </template>
    <template #footer>
      <TheButton @click="emit('resetNoTimeWorkout')">
        {{ $t('common.ok') }}
      </TheButton>
    </template>
  </TheModal>
</template>

<style>
.no-time-modal .modal {
  max-width: 400px;

  & .modal-footer {
    display: flex;
    justify-content: flex-end;
  }

  & .modal-header h3 {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  & .warning-icon {
    color: var(--color-error);
  }
}
</style>
