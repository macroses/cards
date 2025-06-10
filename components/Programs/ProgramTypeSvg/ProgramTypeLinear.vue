<template>
  <svg class="programs-list__item-svg" width="280" height="250" viewBox="0 0 280 250" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; overflow: visible;">
    <!-- Недели -->
    <rect id="week-1" width="70" height="249" class="week-glow-1 delay-0" />
    <rect id="week-2" x="70" width="70" height="249" class="week-glow-2 delay-1" />
    <rect id="week-3" x="140" width="70" height="249" class="week-glow-3 delay-2" />
    <rect id="week-4" x="210" width="70" height="249" class="week-glow-4 delay-3" />

    <!-- Вертикальные линии -->
    <line x1="69.5" y1="249" x2="69.5" y2="1" stroke="#D6D6D6" stroke-dasharray="2 2" />
    <line x1="139.5" y1="249" x2="139.5" y2="1" stroke="#D6D6D6" stroke-dasharray="2 2" />
    <line x1="209.5" y1="249" x2="209.5" y2="1" stroke="#D6D6D6" stroke-dasharray="2 2" />
    <!--    <path d="M0 249.5H280" stroke="#EAEAEA" /> -->

    <!-- Пути -->
    <path id="skill" d="M0.5 228C171.5 228 177.5 -75 249 61" stroke="#AA066E" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="3 3" fill="none" />
    <path id="intensity" d="M1 175.5C164.25 179.5 168.5 -117.5 248 98.5" stroke="#FF4000" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="8 2" fill="none" />
    <path id="volume" d="M1 15C1 15 51.5 22 95 67.5C138.5 113 191.5 235 265.5 243.5" stroke="#0A47FD" stroke-opacity="0.5" stroke-width="2" fill="none" />

    <!-- Анимированные кружочки -->
    <circle class="skill-dot" r="3" fill="white" stroke="#AA066E" stroke-width="1" />
    <circle class="intensity-dot" r="3" fill="white" stroke="#FF4000" stroke-width="1" />
    <circle class="volume-dot" r="3" fill="white" stroke="#0A47FD" stroke-width="1" />
  </svg>
</template>

<style scoped>
.programs-list__item-svg {
  width: 100%;
}

/* Двигающиеся кружки */
.skill-dot, .intensity-dot, .volume-dot {
  offset-distance: 0;
  animation: move 4s ease-in-out infinite;
}

.skill-dot {
  offset-path: path("M0.5 228C171.5 228 177.5 -75 249 61");
}
.intensity-dot {
  offset-path: path("M1 175.5C164.25 179.5 168.5 -117.5 248 98.5");
}
.volume-dot {
  offset-path: path("M1 15C1 15 51.5 22 95 67.5C138.5 113 191.5 235 265.5 243.5");
}

@keyframes move {
  0% { offset-distance: 0; }
  100% { offset-distance: 100%; }
}

/* Анимации свечения по неделям */
.week-glow-1 {
  fill: oklch(0.885 0 89.876 / 0.15);
  animation: flash-green 4s infinite;
}
.week-glow-2 {
  fill: oklch(0.885 0 89.876 / 0.15);
  animation: flash-yellow 4s infinite;
}
.week-glow-3 {
  fill: oklch(0.885 0 89.876 / 0.15);
  animation: flash-orange 4s infinite;
}
.week-glow-4 {
  fill: oklch(0.885 0 89.876 / 0.15);
  animation: flash-green 4s infinite;
}

/* Разные цвета свечения */

/* Смещение по времени */
.delay-0 { animation-delay: 0s; }
.delay-1 { animation-delay: 1s; }
.delay-2 { animation-delay: 2s; }
.delay-3 { animation-delay: 3s; }
</style>
