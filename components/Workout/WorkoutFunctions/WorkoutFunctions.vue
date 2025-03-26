<script setup lang="ts">
import type { WorkoutFunctionsProps } from '~/ts/componentProps'
import TheModal from '~/components/ui/TheModal/TheModal.vue'

const props = withDefaults(defineProps<WorkoutFunctionsProps>(), {
  isCopyMode: false,
  isWorkoutActive: false,
})

const emit = defineEmits<{
  (event: 'deleteWorkout'): void
  (event: 'copyWorkout'): void
  (event: 'updateWorkout'): void
  (event: 'openResults'): void
}>()

const localePath = useLocalePath()
const runWorkoutConfirm = ref<typeof TheModal | null>(null)

const { startWorkout } = useStartWorkout()
const { activeWorkout } = useWorkoutTimer()

const showStartButton = computed(() => {
  if (props.isWorkoutCompleted) {
    return false
  }

  return props.isWorkoutActive || !activeWorkout.value
})

function openRunWorkoutConfirm() {
  if (props.isWorkoutActive) {
    navigateTo(localePath(`/workout/run/${props.workoutId}`))
    return
  }

  runWorkoutConfirm.value?.openModal()
}
async function handleStartWorkout() {
  await startWorkout(props.workoutId)
  navigateTo(localePath(`/workout/run/${props.workoutId}`))
}

function closeRunWorkoutConfirm() {
  runWorkoutConfirm.value?.closeModal()
}

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false
})
</script>

<template>
  <div
    class="date-menu"
    :class="{ 'date-menu__completed': isWorkoutCompleted }"
  >
    <div class="date-menu__event-name">
      {{ workoutTitle }}
    </div>

    <ul class="date-menu__functions">
      <li v-if="isWorkoutCompleted">
        <TheButton
          variant="secondary"
          @click="$emit('openResults')"
        >
          Results
        </TheButton>
      </li>
      <li v-else-if="showStartButton">
        <TheButton
          :variant="isWorkoutActive ? 'warning' : 'success'"
          @click="openRunWorkoutConfirm"
        >
          {{ isWorkoutActive ? 'Go on' : 'Start' }}
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <div
          ref="dropdownRef"
          class="date-menu__dropdown"
        >
          <TheButton
            v-tooltip="$t('main_navigation.more_options')"
            variant="ghost"
            icon-only
            @click.stop="toggleDropdown"
          >
            <TheIcon
              icon-name="sliders"
              width="18px"
            />
          </TheButton>

          <ul
            v-if="isDropdownOpen"
            v-auto-animate="{ duration: 100 }"
            class="date-menu__dropdown-menu"
          >
            <li>
              <button
                class="date-menu__dropdown-item date-menu__dropdown-item--copy"
                @click.stop="emit('copyWorkout')"
              >
                <TheIcon icon-name="copy" width="18px" />
                {{ $t('main_navigation.copy_workout') }}
              </button>
            </li>
            <li v-if="!isWorkoutCompleted && !isWorkoutActive">
              <button
                class="date-menu__dropdown-item date-menu__dropdown-item--update"
                @click="emit('updateWorkout')"
              >
                <TheIcon icon-name="pen-to-square" width="18px" />
                {{ $t('main_navigation.edit_workout') }}
              </button>
            </li>
            <li>
              <button
                class="date-menu__dropdown-item date-menu__dropdown-item--delete"
                @click.stop="emit('deleteWorkout')"
              >
                <TheIcon icon-name="trash-can" width="18px" />
                {{ $t('main_navigation.delete_workout') }}
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>

    <TheModal
      ref="runWorkoutConfirm"
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
            @click="closeRunWorkoutConfirm"
          >
            отменить
          </TheButton>
          <TheButton
            @click="handleStartWorkout"
          >
            начать
          </TheButton>
        </div>
      </template>
    </TheModal>
  </div>
</template>

<style src="./style.css" />

<style>
.date-menu__dropdown {
  position: relative;
}

.date-menu__dropdown-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: var(--color-white);
  border: 1px solid oklch(from var(--color-accent) l c h / 0.2);
  box-shadow: oklch(from var(--color-accent) l c h / 0.1) -4px 9px 25px -6px;
  border-radius: 12px;
  padding: 4px;
  z-index: 10;
}

.date-menu__dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  white-space: nowrap;
  border-radius: 8px;
  text-align: left;
  background-color: transparent;
  border: 1px solid transparent;
  transition: background-color var(--base-transition);
  cursor: pointer;

  &.date-menu__dropdown-item--delete {
    &:hover {
      border: 1px solid var(--difficulty-5);
      background-color: oklch(from var(--difficulty-5) l c h / 0.1);
    }

    & svg {
      color: var(--difficulty-5);
    }
  }

  &.date-menu__dropdown-item--update,
  &.date-menu__dropdown-item--copy {
    &:hover {
      border: 1px solid var(--color-accent);
      background-color: oklch(from var(--color-accent) l c h / 0.1);
    }

    & svg {
      color: var(--color-accent);
    }
  }
}
</style>
