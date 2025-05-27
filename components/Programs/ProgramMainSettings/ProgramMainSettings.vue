<script setup lang="ts">
import type { MainSettingsFields } from '~/ts/interfaces'
import { MAIN_SETTINGS_FIELDS } from '~/constants'

const emit = defineEmits(['update:settings'])

const mainSettingsFields = reactive<MainSettingsFields>({
  weeksCounter: 12,
  startPMPercent: 65,
  pmpIncreasePercent: 1.5,
  weekNumber: 4,
  weekPMPercentDecrease: 10,
  weekTrainingFrequency: 3,
})

const validationRules = {
  weeksCounter: [
    createValidationRule('required'),
    createValidationRule('numbersOnly'),
    createValidationRule('minValue', 4),
    createValidationRule('maxValue', 12),
  ],
  startPMPercent: [
    createValidationRule('required'),
    createValidationRule('numbersOnly'),
    createValidationRule('minValue', 40),
    createValidationRule('maxValue', 100),
  ],
  pmpIncreasePercent: [
    createValidationRule('required'),
    createValidationRule('minValue', 0),
    createValidationRule('maxValue', 100),
  ],
  weekNumber: [
    createValidationRule('required'),
    createValidationRule('numbersOnly'),
    createValidationRule('minValue', 1),
    createValidationRule('maxValue', 12),
  ],
  weekPMPercentDecrease: [
    createValidationRule('required'),
    createValidationRule('minValue', 0),
    createValidationRule('maxValue', 100),
  ],
  weekTrainingFrequency: [
    createValidationRule('required'),
    createValidationRule('numbersOnly'),
    createValidationRule('minValue', 1),
    createValidationRule('maxValue', 7),
  ],
}

watch(mainSettingsFields, () => {
  emit('update:settings', getSettings())
}, { deep: true })

function getSettings(): MainSettingsFields {
  return { ...mainSettingsFields }
}

defineExpose({ getSettings })
</script>

<template>
  <div class="program__main-settings">
    <dl class="program__main-settings__list">
      <div
        v-for="field in MAIN_SETTINGS_FIELDS"
        :key="field.key"
        class="program__main-settings__item"
      >
        <dt>{{ $t(field.label) }}</dt>
        <dd>
          <TheInput
            v-model.number="mainSettingsFields[field.key]"
            :validate-rules="validationRules[field.key]"
          />
        </dd>
      </div>
    </dl>
  </div>
</template>

<style src="./style.css" />
