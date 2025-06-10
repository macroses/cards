<script setup lang="ts">
const animationKey = ref(0)
let timer: NodeJS.Timeout

function resetAnimation() {
  const animationDuration = 8000

  if (timer) {
    clearInterval(timer)
  }

  timer = setInterval(() => {
    animationKey.value++
  }, animationDuration)
}

onMounted(() => {
  resetAnimation()
})
</script>

<template>
  <svg
    :key="animationKey"
    class="programs-list__item-svg animation-container" width="281" height="250"
    viewBox="0 0 281 250"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="281" height="250" fill="#D9D9D9" fill-opacity="0.15" />

    <!-- Accumulation -->
    <rect x="0" y="55" width="15.4348" height="195" class="bar bar--accumulation" style="--index: 0" fill="#BFD5DA" />
    <rect x="18.5217" y="55" width="15.4348" height="195" class="bar bar--accumulation" style="--index: 1" fill="#BFD5DA" />
    <rect x="37.0435" y="55" width="15.4348" height="195" class="bar bar--accumulation" style="--index: 2" fill="#BFD5DA" />
    <rect x="55.5652" y="55" width="15.4348" height="195" class="bar bar--accumulation" style="--index: 3" fill="#BFD5DA" />

    <!-- Transition Week 1 -->
    <rect x="75.5" y="16" width="13" height="234" class="bar bar--transition1" fill="#D9D9D9" stroke="#CECECE" />

    <!-- Transformation -->
    <rect x="93" y="101" width="15" height="149" class="bar bar--transformation" style="--index: 0" fill="#BFA0B5" />
    <rect x="112" y="101" width="15" height="149" class="bar bar--transformation" style="--index: 1" fill="#BFA0B5" />
    <rect x="132" y="101" width="15" height="149" class="bar bar--transformation" style="--index: 2" fill="#BFA0B5" />
    <rect x="152" y="101" width="15" height="149" class="bar bar--transformation" style="--index: 3" fill="#BFA0B5" />

    <!-- Transition Week 2 -->
    <rect x="172" y="16" width="14" height="234" class="bar bar--transition2" fill="#D9D9D9" />

    <!-- Realization -->
    <rect x="190" y="152" width="15" height="98" class="bar bar--realization" style="--index: 0" fill="#E89395" />
    <rect x="210" y="152" width="15" height="98" class="bar bar--realization" style="--index: 1" fill="#E89395" />
    <rect x="230" y="152" width="15" height="98" class="bar bar--realization" style="--index: 2" fill="#E89395" />
    <rect x="250" y="152" width="15" height="98" class="bar bar--realization" style="--index: 3" fill="#E89395" />

    <!-- Transition Week 3 -->
    <rect x="268" y="16" width="13" height="234" class="bar bar--transition3" fill="#D9D9D9" />
  </svg>
</template>

<style scoped>
.programs-list__item-svg {
  width: 100%;
  height: auto;
}

.animation-container {
  animation: reset-animation 7.5s linear infinite;
}

.bar {
  transform: scaleY(0);
  transform-origin: bottom;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-fill-mode: forwards;
}

.bar--accumulation {
  animation-name: grow-wave;
  animation-duration: 0.7s;
  animation-delay: calc(0s + var(--index) * 0.2s);
}

.bar--transition1 {
  animation: grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.3s forwards;
}

.bar--transformation {
  animation-name: grow-wave;
  animation-duration: 0.7s;
  animation-delay: calc(1.7s + var(--index) * 0.2s);
}

.bar--transition2 {
  animation: grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 3s forwards;
}

.bar--realization {
  animation-name: grow-wave;
  animation-duration: 0.7s;
  animation-delay: calc(3.4s + var(--index) * 0.2s);
}

.bar--transition3 {
  animation: grow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 4.7s forwards;
}

@keyframes grow {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes grow-wave {
  0% {
    transform: scaleY(0) translateX(-2px);
    opacity: 0;
  }
  60% {
    transform: scaleY(1.05) translateX(1px);
    opacity: 1;
  }
  80% {
    transform: scaleY(0.97) translateX(0);
  }
  100% {
    transform: scaleY(1) translateX(0);
  }
}

@keyframes reset-animation {
  0%, 99.9% {
    opacity: 1;
  }
  100% {
    opacity: 0.999;
  }
}
</style>
