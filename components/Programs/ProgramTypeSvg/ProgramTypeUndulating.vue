<template>
  <svg class="programs-list__item-svg" width="281" height="250" viewBox="0 0 281 250" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: relative; overflow: visible;">
    <rect width="281" height="250" fill="#D9D9D9" fill-opacity="0.15" />
    <rect id="week-4" x="210" width="71" height="250" class="week-glow-4 delay-3" />
    <path
      d="M2.5 55.3435C10.1909 36.032 18.9375 36.4981 19.7188 60.0549C20.5 83.6116 31.875 87.5477 36.9375 64.7662C42 41.9847 54.5 42.9389 54.1562 69.4776C53.8125 96.0162 65.25 103.531 71.375 74.1889C77.5 44.8473 89.1875 50.6321 88.5938 78.9003C88 107.168 101.125 111.88 105.812 83.6116C110.5 55.3435 124.062 60.0548 123.031 88.323C122 116.591 133.5 126.014 140.25 93.0343C147 60.0549 158.438 69.4776 157.469 97.7457C156.5 126.014 168.375 135.437 174.688 102.457C181 69.4776 193.312 83.6116 191.906 107.168C190.5 130.725 201.75 144.859 209.125 111.88C216.5 78.9003 279.5 137.405 279.5 137.405" stroke="#0A47FD" stroke-opacity="0.5" stroke-width="2" fill="none"
    />
    <line x1="211.5" x2="211.5" y2="250" stroke="#B1B1B1" stroke-dasharray="2 2" />
    <path d="M3 196.565C123.38 241.114 184.5 -94.4657 278.5 137.404" stroke="#AA066E" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="3 3" fill="none" />
    <path d="M1.5 122.138C180.5 162.214 195 -90.6489 278.5 137.405" stroke="#FF4000" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="6 2" fill="none" />

    <circle class="skill-dot" r="3" fill="white" stroke="#AA066E" stroke-width="1" />
    <circle class="intensity-dot" r="3" fill="white" stroke="#FF4000" stroke-width="1" />
    <circle class="volume-dot" r="3" fill="white" stroke="#0A47FD" stroke-width="1" />
  </svg>
</template>

<style scoped>
.programs-list__item-svg {
  width: 100%;
}

.skill-dot, .intensity-dot, .volume-dot {
  offset-distance: 0;
  animation: move 8s ease-in-out infinite;
}

.skill-dot {
  offset-path: path("M3 196.565C123.38 241.114 184.5 -94.4657 278.5 137.404");
}
.intensity-dot {
  offset-path: path("M1.5 122.138C180.5 162.214 195 -90.6489 278.5 137.405");
}
.volume-dot {
  offset-path: path("M2.5 55.3435C10.1909 36.032 18.9375 36.4981 19.7188 60.0549C20.5 83.6116 31.875 87.5477 36.9375 64.7662C42 41.9847 54.5 42.9389 54.1562 69.4776C53.8125 96.0162 65.25 103.531 71.375 74.1889C77.5 44.8473 89.1875 50.6321 88.5938 78.9003C88 107.168 101.125 111.88 105.812 83.6116C110.5 55.3435 124.062 60.0548 123.031 88.323C122 116.591 133.5 126.014 140.25 93.0343C147 60.0549 158.438 69.4776 157.469 97.7457C156.5 126.014 168.375 135.437 174.688 102.457C181 69.4776 193.312 83.6116 191.906 107.168C190.5 130.725 201.75 144.859 209.125 111.88C216.5 78.9003 279.5 137.405 279.5 137.405");
}

@keyframes move {
  0% { offset-distance: 0; }
  100% { offset-distance: 100%; }
}

[class^="week-glow-"] {
  fill: oklch(0.885 0 89.876 / 0.15);
}

.week-glow-4 {
  fill: oklch(0.885 0 89.876 / 0.15);
  animation: flash-green 8s infinite;
}

@keyframes flash-green {
  0%, 100% { fill: oklch(0.885 0.2 145 / 0); }
  25%      { fill: oklch(0.885 0.2 145 / 0.1); }
  50%      { fill: oklch(0.885 0.2 145 / 0.15); }
}

.delay-0 { animation-delay: 0s; }
.delay-1 { animation-delay: 2s; }
.delay-2 { animation-delay: 4s; }
.delay-3 { animation-delay: 6s; }
</style>
