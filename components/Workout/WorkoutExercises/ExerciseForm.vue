<script setup lang="ts">
import type {
  TrainingSession,
} from '~/ts'
import { nanoid } from 'nanoid'
import { validationSchemas } from '@/validation/schemas/common.schema'
import { DIFFICULT_LEVEL } from '~/ts/enums/workoutColors.enum'

const props = defineProps<{
  exerciseId: string
  sessions: TrainingSession[]
}>()

const emit = defineEmits<{
  (event: 'addSet', exerciseForm: TrainingSession): void
  (event: 'removeSet', setId: string): void
}>()

const { t } = useI18n()
const { createExerciseSetSchema } = validationSchemas(t)

const { defineField, errors, values, meta } = useForm({
  validationSchema: toTypedSchema(createExerciseSetSchema),
})

const [weight] = defineField('weight')
const [repeats] = defineField('repeats')

const isAppendSessionDisable = computed(() => {
  return values.weight && values.repeats && meta.value.valid
})

function appendSession() {
  if (!isAppendSessionDisable.value) {
    return
  }

  emit('addSet', {
    id: nanoid(),
    exerciseId: props.exerciseId,
    weight: values.weight,
    repeats: values.repeats,
    difficulty: DIFFICULT_LEVEL.WARM,
    completed: false,
    setTime: null,
  } as TrainingSession)
}

function getExerciseSessions() {
  return props.sessions.filter((session: TrainingSession) => session.exerciseId === props.exerciseId)
}
</script>

<template>
  <div class="exercise-form__wr">
    <form
      v-auto-animate="{ duration: 300 }"
      class="exercise-form"
      @submit.prevent="appendSession"
    >
      <div class="exercise-form__main">
        <TheInput
          v-model="weight"
          placeholder="Вес"
          type="number"
          inputmode="numeric"
          :error-message="errors.weight"
          @keydown="onlyNumbers"
        />
        <TheInput
          v-model="repeats"
          placeholder="Повторения"
          type="number"
          inputmode="numeric"
          :error-message="errors.repeats"
          @keydown="onlyNumbers"
        />
        <TheButton
          type="submit"
          :disabled="!isAppendSessionDisable"
        >
          Добавить
        </TheButton>
      </div>
      <ul
        v-if="getExerciseSessions().length"
        v-auto-animate="{ duration: 300 }"
        class="workout-form__sets"
      >
        <li class="workout-form__sets-header">
          <div class="workout-form__sets-header--weight">
            Вес
          </div>
          <div class="workout-form__sets-header--repeats">
            Repeats
          </div>
          <div class="workout-form__sets-header--delete" />
        </li>
        <li
          v-for="set in getExerciseSessions()"
          :key="set.id"
          class="workout-form__sets-item"
        >
          <div class="workout-form__sets--weight">
            {{ set.weight }}
          </div>
          <div class="workout-form__sets--repeats">
            {{ set.repeats }}
          </div>
          <TheButton
            variant="transparent"
            icon-only
            @click="emit('removeSet', set.id)"
          >
            <TheIcon
              icon-name="xmark"
              width="16"
            />
          </TheButton>
        </li>
      </ul>
    </form>
  </div>
</template>
