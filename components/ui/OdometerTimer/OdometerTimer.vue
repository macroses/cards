<script setup lang="ts">
const props = defineProps<{
  time: string
}>()

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

const timeGroups = computed(() => {
  const parts = props.time.split(':')
  // If time is '00', so return only minutes and seconds
  return (parts[0] === '00' ? parts.slice(1) : parts).map(part => part.split(''))
})

function getTransform(digit: string): string {
  return `translateY(-${DIGITS.indexOf(digit) * 100}%)`
}
</script>

<template>
  <div class="odometer-timer">
    <template v-for="(group, groupIndex) in timeGroups" :key="groupIndex">
      <div class="odometer-group">
        <div
          v-for="(digit, digitIndex) in group"
          :key="`${groupIndex}-${digitIndex}`"
          class="odometer-digit"
        >
          <div
            class="odometer-digit__wrapper"
            :style="{ transform: getTransform(digit) }"
          >
            <div
              v-for="num in DIGITS"
              :key="num"
              class="odometer-digit__number"
            >
              {{ digit }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="groupIndex < timeGroups.length - 1"
        class="odometer-separator"
      >
        :
      </div>
    </template>
  </div>
</template>

<style scoped>
.odometer-timer {
  display: flex;
  align-items: center;
  gap: 2px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

.odometer-group {
  display: flex;
}

.odometer-digit {
  position: relative;
  width: 0.6em;
  height: 1em;
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.odometer-separator {
  padding: 0 2px;
  display: flex;
  align-items: center;
}

.odometer-digit__wrapper {
  position: absolute;
  inset: 0;
  transition: transform 0.2s linear;
  will-change: transform;
}

.odometer-digit__number {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
