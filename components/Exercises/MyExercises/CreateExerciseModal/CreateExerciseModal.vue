<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import {
  EXERCISE_CATEGORY,
  EXERCISE_EQUIPMENT,
  EXERCISE_FORCE,
  EXERCISE_LEVEL,
} from '~/constants'
import type { ExerciseServerTemplate } from '~/ts/interfaces'

const props = defineProps<{
  exercisesList: ExerciseServerTemplate[]
}>()

const emit = defineEmits<{
  submit: [exercise: Omit<ExerciseServerTemplate, 'id'>]
}>()

const modalRef = ref<typeof TheModal | null>(null)

const muscles = computed(() => {
  const uniqueMuscles = new Set(props.exercisesList.map(exercise => exercise.primary))

  return Array.from(uniqueMuscles).map(muscleName => ({
    id: props.exercisesList.find(ex => ex.primary === muscleName)?.muscleId || 0,
    value: muscleName,
  }))
})

const userExercise = reactive<Omit<ExerciseServerTemplate, 'id'>>({
  name: '',
  muscleId: muscles.value[0].id,
  primary: muscles.value[0].value,
  secondary: [],
  category: EXERCISE_CATEGORY[0],
  equipment: '',
  force: EXERCISE_FORCE[0],
  level: EXERCISE_LEVEL[0],
})

const chosenSecondaryMuscles = computed(() => {
  return userExercise.secondary.map(muscleName => ({
    id: props.exercisesList.find(ex => ex.primary === muscleName)?.muscleId || 0,
    value: muscleName,
  }))
})

const availableSecondaryMuscles = computed(() => {
  return muscles.value.filter(muscle => muscle.value !== userExercise.primary)
})

function addSecondaryMuscles(item: { id: number, value: string }) {
  if (!userExercise.secondary.includes(item.value)) {
    userExercise.secondary.push(item.value)
  }
}

function removeSecondaryMuscles(muscleOption: { id: number, value: string }) {
  userExercise.secondary = userExercise.secondary.filter(muscle => muscle !== muscleOption.value)
}

function openModal() {
  modalRef.value?.openModal()
}

function closeModal() {
  modalRef.value?.closeModal()
}

async function handleSubmit() {
  emit('submit', userExercise)
  closeModal()
}

watch(() => userExercise.primary, (newPrimary) => {
  userExercise.secondary = userExercise.secondary.filter(muscle => muscle !== newPrimary)
})

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <TheModal
    ref="modalRef"
    class="create-exercise-modal"
  >
    <template #title>
      <h3>Создать упражнение</h3>
    </template>
    <template #content>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Название</label>
          <TheInput
            v-model="userExercise.name"
            placeholder="Название упражнения"
            :validate-rules="[createValidationRule('required')]"
            :max="50"
          />
        </div>

        <div class="form-group">
          <label>Основная мышечная группа</label>
          <TheSelect
            v-model:id="userExercise.muscleId"
            v-model:value="userExercise.primary"
            :dropdown-list="muscles"
          />
        </div>

        <div class="form-group">
          <label>Второстепенные мышцы</label>
          <TheMultiSelect
            label="Secondary muscles"
            :multiselect-list="availableSecondaryMuscles"
            :chosen-items="chosenSecondaryMuscles"
            @remove-items="removeSecondaryMuscles"
            @get-items="addSecondaryMuscles"
          />
        </div>

        <div class="form-group">
          <div>Категория</div>
          <TheRadio
            v-for="category in EXERCISE_CATEGORY"
            :key="category"
            v-model="userExercise.category"
            :value="category"
            name="category"
            :label="category"
          />
        </div>

        <div class="form-group">
          <label>Оборудование</label>
          <TheSelect
            v-model:value="userExercise.equipment"
            :dropdown-list="EXERCISE_EQUIPMENT"
          />
        </div>

        <div class="form-group">
          <label>Тип нагрузки</label>
          <TheRadio
            v-for="force in EXERCISE_FORCE"
            :key="force"
            v-model="userExercise.force"
            :value="force"
            name="force"
            :label="force"
          />
        </div>

        <div class="form-group">
          <label>Уровень сложности</label>
          <TheRadio
            v-for="level in EXERCISE_LEVEL"
            :key="level"
            v-model="userExercise.level"
            :value="level"
            name="level"
            :label="level"
          />
        </div>

        <div class="form-actions">
          <TheButton type="submit">
            Сохранить
          </TheButton>
        </div>
      </form>
    </template>
  </TheModal>
</template>

<style src="./style.css" />
