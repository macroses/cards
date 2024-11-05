<template>
  <div class="workout">
    <div class="workout-data">
      <slot name="description" />
      <slot name="workout-exercises" />
    </div>
    <slot name="exercises-list" />
  </div>
</template>
