<script setup lang="ts">
import type TheModal from '~/components/ui/TheModal/TheModal.vue'
import {
  EXERCISE_CATEGORY,
  EXERCISE_EQUIPMENT,
  EXERCISE_FORCE,
  EXERCISE_LEVEL,
} from '~/constants'
import type { ExerciseServerTemplate, UserWorkoutExercise } from '~/ts/interfaces'

const props = defineProps<{
  exercisesList: ExerciseServerTemplate[]
  selectedExercises: UserWorkoutExercise[]
}>()

const emit = defineEmits<{
  selectExercise: [exercise: UserWorkoutExercise]
  openModal: [exercise: ExerciseServerTemplate]
}>()

const {
  exercises,
  isLoading,
  error,
  createExercise,
} = useExerciseHandle()

const myModalRef = ref<typeof TheModal | null>(null)

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

function removeSecondaryMuscles() {
  userExercise.secondary = []
}

function handleOpenModal() {
  myModalRef.value?.openModal()
}

async function handleSubmit() {
  await createExercise(userExercise)
  myModalRef.value?.closeModal()
}

watch(() => userExercise.primary, (newPrimary) => {
  // Удаляем из второстепенных мышц ту, которая стала основной
  userExercise.secondary = userExercise.secondary.filter(muscle => muscle !== newPrimary)
})

function selectExercise(exercise: ExerciseServerTemplate) {
  emit('selectExercise', {
    id: exercise.id,
    name: exercise.name,
  })
}

function isExerciseSelected(exerciseId: string) {
  return props.selectedExercises.some(selected => selected.id === exerciseId)
}
</script>

<template>
  <div class="my_exercises">
    <TheLoader v-if="isLoading" />
    <p v-else-if="error">
      {{ error }}
    </p>
    <ul
      v-else
      class="my_exercises__list"
    >
      <li
        v-for="exercise in exercises"
        :key="exercise.id"
        class="my_exercises__list-item"
        :class="{ selected: isExerciseSelected(exercise.id) }"
        @click="selectExercise(exercise)"
      >
        {{ exercise.name }}
        <TheButton
          variant="transparent"
          @click.stop="emit('openModal', exercise)"
        >
          <TheIcon
            icon-name="circle-info"
            width="20px"
          />
        </TheButton>
      </li>
    </ul>
    <TheButton @click="handleOpenModal">
      + Добавить
    </TheButton>

    <LazyTheModal ref="myModalRef">
      <template #title>
        <h3>Создать упражнение</h3>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
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
    </LazyTheModal>
  </div>
</template>

<style src="./style.css" />
