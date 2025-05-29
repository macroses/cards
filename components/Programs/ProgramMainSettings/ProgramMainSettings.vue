<script setup lang="ts">
import type { MainSettingsFields } from '~/ts/interfaces'
import { MAIN_SETTINGS_FIELDS } from '~/constants'
import { mainSettingsSchema } from '~/ts/interfaces'

const emit = defineEmits(['update:settings'])

const { values, setFieldValue, errors, meta } = useForm({
  validationSchema: toTypedSchema(mainSettingsSchema),
  initialValues: {
    weeksCounter: 12,
    startPMPercent: 65,
    pmpIncreasePercent: 1.5,
    weekNumber: 4,
    weekPMPercentDecrease: 10,
    weekTrainingFrequency: 3,
  },
})

const formState = computed(() => ({
  values,
  isValid: meta.value.valid,
}))

watch(formState, ({ isValid }) => {
  if (isValid) {
    emit('update:settings', getSettings())
  }
})

function getSettings(): MainSettingsFields {
  return {
    weeksCounter: Number(values.weeksCounter),
    startPMPercent: Number(values.startPMPercent),
    pmpIncreasePercent: Number(values.pmpIncreasePercent),
    weekNumber: Number(values.weekNumber),
    weekPMPercentDecrease: Number(values.weekPMPercentDecrease),
    weekTrainingFrequency: Number(values.weekTrainingFrequency),
  }
}

function handleInputChange(field: keyof MainSettingsFields, value: number) {
  setFieldValue(field, value)
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
            :name="field.key"
            :model-value="values[field.key]"
            @keydown="onlyNumbers"
            @input="handleInputChange(field.key, Number($event.target.value))"
          />
          <p v-if="errors[field.key]" class="error-message">
            {{ errors[field.key] }}
          </p>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style src="./style.css" />
