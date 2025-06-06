<template>
  <svg class="programs-list__item-svg" width="280" height="131" viewBox="0 0 280 131" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; overflow: visible;">
    <!-- Недели -->
    <rect id="week-1" width="70" height="130" class="week-glow-1 delay-0" />
    <rect id="week-2" x="70" width="70" height="130" class="week-glow-2 delay-1" />
    <rect id="week-3" x="140" width="70" height="130" class="week-glow-3 delay-2" />
    <rect id="week-4" x="210" width="70" height="130" class="week-glow-4 delay-3" />

    <!-- Вертикальные линии -->
    <line x1="69.5" y1="131" x2="69.5" y2="1" stroke="#D6D6D6" stroke-dasharray="2 2" />
    <line x1="139.5" y1="131" x2="139.5" y2="1" stroke="#D6D6D6" stroke-dasharray="2 2" />
    <line x1="209.5" y1="131" x2="209.5" y2="1" stroke="#D6D6D6" stroke-dasharray="2 2" />
    <path d="M0 130.5H280" stroke="#EAEAEA" />

    <!-- Пути -->
    <path id="skill" d="M0.5 119.5C171.5 119.5 177.5 -39.5 249 32" stroke="#AA066E" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="3 3" fill="none" />
    <path id="intensity" d="M1 92C164.25 94.0169 168.5 -61.5 248 51.5" stroke="#FF4000" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="8 2" fill="none" />
    <path id="volume" d="M1 7.99998C1 7.99998 51.5 11.5 95 35.5C138.5 59.5 191.5 123 265.5 127.5" stroke="#0A47FD" stroke-opacity="0.5" stroke-width="2" fill="none" />

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
  offset-path: path("M0.5 119.5C171.5 119.5 177.5 -39.5 249 32");
}
.intensity-dot {
  offset-path: path("M1 92C164.25 94.0169 168.5 -61.5 248 51.5");
}
.volume-dot {
  offset-path: path("M1 7.99998C1 7.99998 51.5 11.5 95 35.5C138.5 59.5 191.5 123 265.5 127.5");
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
@keyframes flash-green {
  0%, 100% { fill: oklch(0.885 0.2 145 / 0); }
  25%      { fill: oklch(0.885 0.2 145 / 0.1); }
  50%      { fill: oklch(0.885 0.2 145 / 0.15); }
}
@keyframes flash-yellow {
  0%, 100% { fill: oklch(0.95 0.1 100 / 0); }
  25%      { fill: oklch(0.95 0.1 100 / 0.1); }
  50%      { fill: oklch(0.95 0.1 100 / 0.15); }
}
@keyframes flash-orange {
  0%, 100% { fill: oklch(0.8 0.25 50 / 0); }
  25%      { fill: oklch(0.8 0.25 50 / 0.1); }
  50%      { fill: oklch(0.8 0.25 50 / 0.15); }
}

/* Смещение по времени */
.delay-0 { animation-delay: 0s; }
.delay-1 { animation-delay: 1s; }
.delay-2 { animation-delay: 2s; }
.delay-3 { animation-delay: 3s; }
</style>
