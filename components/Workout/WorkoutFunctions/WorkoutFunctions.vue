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

  return !activeWorkout.value || props.isWorkoutActive
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

const particleCanvas = ref<HTMLCanvasElement | null>(null)
let particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}> = []
let animationFrame: number

onMounted(() => {
  if (particleCanvas.value) {
    initParticles()
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrame)
})

function initParticles() {
  const canvas = particleCanvas.value!
  const ctx = canvas.getContext('2d')!

  const updateCanvasSize = () => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
  }

  updateCanvasSize()
  window.addEventListener('resize', updateCanvasSize)

  function createParticle() {
    const buttonSize = 60 * window.devicePixelRatio
    const buttonX = canvas.width / 2
    const buttonY = canvas.height - (buttonSize / 2)

    const angle = Math.PI + (Math.random() * Math.PI)
    const radius = buttonSize / 2
    const startX = buttonX + Math.cos(angle) * radius
    const startY = buttonY + Math.sin(angle) * radius

    const baseSpeed = 0.5 + Math.random()
    const color = props.isWorkoutActive ? 'rgb(255, 172, 2)' : 'rgb(11, 176, 11)'

    return {
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -baseSpeed - Math.random() * 1.5,
      size: 1,
      life: 1,
      color,
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Создаем новые частицы каждый кадр
    for (let i = 0; i < 3; i++) {
      particles.push(createParticle())
    }

    particles = particles.filter((particle) => {
      particle.vx += (Math.random() - 0.5) * 0.1
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life -= 0.015

      ctx.beginPath()
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 2 * window.devicePixelRatio,
      )

      gradient.addColorStop(0, `${particle.color.slice(0, -1)}, ${particle.life})`)
      gradient.addColorStop(1, `${particle.color.slice(0, -1)}, 0)`)

      ctx.fillStyle = gradient
      ctx.arc(
        particle.x,
        particle.y,
        particle.size * window.devicePixelRatio,
        0,
        Math.PI * 2,
      )
      ctx.fill()

      return particle.life > 0
    })

    animationFrame = requestAnimationFrame(animate)
  }

  animate()

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateCanvasSize)
  })
}

// Watch for changes in isWorkoutActive to update particle colors
watch(() => props.isWorkoutActive, () => {
  particles = []
})
</script>

<template>
  <div class="date-menu">
    <div class="date-menu__event-name">
      <TheIcon
        v-if="isWorkoutCompleted"
        v-tooltip="$t('toast.workout_completed')"
        icon-name="circle-check"
        width="18px"
        @click="$emit('openResults')"
      />
      {{ workoutTitle }}
    </div>

    <ul
      class="date-menu__functions"
    >
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="$t('main_navigation.copy_workout')"
          variant="ghost"
          icon-only
          @click.stop="emit('copyWorkout')"
        >
          <TheIcon
            icon-name="copy"
            width="18px"
          />
        </TheButton>
      </li>
      <li
        v-if="!isWorkoutCompleted && !isWorkoutActive"
        class="date-menu__functions-item"
      >
        <TheButton
          v-tooltip="$t('main_navigation.edit_workout')"
          variant="ghost"
          icon-only
          @click="emit('updateWorkout')"
        >
          <TheIcon
            icon-name="pen-to-square"
            width="18px"
          />
        </TheButton>
      </li>
      <li class="date-menu__functions-item">
        <TheButton
          v-tooltip="$t('main_navigation.delete_workout')"
          variant="ghost"
          icon-only
          @click.stop="emit('deleteWorkout')"
        >
          <TheIcon
            icon-name="trash-can"
            width="18px"
          />
        </TheButton>
      </li>
    </ul>

    <div
      v-if="showStartButton"
      class="start-workout__wr"
    >
      <canvas ref="particleCanvas" class="start-workout__particles" />
      <button
        class="start-workout__button"
        :class="{ activeWorkout: isWorkoutActive }"
        @click="openRunWorkoutConfirm"
      >
        {{ isWorkoutActive ? 'Go on' : 'Start' }}
      </button>
    </div>

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
