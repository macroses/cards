<template>
  <div class="workout">
    <div class="workout-data">
      <div
        v-auto-animate="{ duration: 100 }"
        class="workout-description__wrapper"
      >
        <slot name="description" />
      </div>
      <slot name="workout-exercises" />
    </div>
    <slot name="exercises-list" />
  </div>
</template>
