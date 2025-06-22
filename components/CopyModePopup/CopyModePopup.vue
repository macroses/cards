<script  lang="ts" setup="">
defineProps<{
  isCopyMode: boolean
}>()

const emit = defineEmits<{
  'update:isCopyMode': [value: boolean]
}>()

function closeCopyMode() {
  emit('update:isCopyMode', false)
}
</script>

<template>
  <Transition>
    <div
      v-if="isCopyMode"
      class="copy-mode__popup"
    >
      {{ $t('workout.select_date_to_copy') }}
      <TheButton
        variant="secondary"
        icon-only
        @click="closeCopyMode"
      >
        <TheIcon
          icon-name="xmark"
          width="20"
        />
      </TheButton>
    </div>
  </Transition>
</template>
