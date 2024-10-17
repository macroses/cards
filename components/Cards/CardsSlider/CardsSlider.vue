<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Card } from '~/types/Card'

const props = defineProps<{
  cards: Card[]
}>()

const currentIndex = ref(0)
const showAnswer = ref(false)
const direction = ref('next')

const currentCard = computed(() => props.cards[currentIndex.value])

const isNextDisabled = computed(() => currentIndex.value >= props.cards.length - 1)
const isPrevDisabled = computed(() => currentIndex.value <= 0)

function nextCard() {
  if (currentIndex.value < props.cards.length - 1) {
    direction.value = 'next'
    currentIndex.value++
    showAnswer.value = false
  }
}

function prevCard() {
  if (currentIndex.value > 0) {
    direction.value = 'prev'
    currentIndex.value--
    showAnswer.value = false
  }
}

function toggleAnswer() {
  showAnswer.value = !showAnswer.value
}
</script>

<template>
  <div class="card-slider">
    <Transition :name="direction" mode="out-in">
      <div :key="currentIndex" class="card-container">
        <div class="card" :class="{ 'is-flipped': showAnswer }" @click="toggleAnswer">
          <div class="card-face card-front">
            <div class="card-content">
              <p>{{ currentCard.question }}</p>
            </div>
          </div>
          <div class="card-face card-back">
            <div class="card-content">
              <p>{{ currentCard.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <div class="card-controls">
      <TheButton
        :disabled="isPrevDisabled"
        @click="prevCard"
      >
        <TheIcon icon-name="angle-left" width="18px" />
        Назад
      </TheButton>
      <TheButton
        :disabled="isNextDisabled"
        @click="nextCard"
      >
        Вперед
        <TheIcon icon-name="angle-right" width="18px" />
      </TheButton>
    </div>
  </div>
</template>

<style scoped>
.card-slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  overflow: hidden;
}

.card-container {
  padding: 20px;
  width: 90%;
  height: 200px;
  perspective: 1500px;
}

.card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.4s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.card.is-flipped {
  transform: rotateX(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(var(--border-color));
  border-radius: 8px;
  background-color: white;
  font-size: 24px;
}

.card-back {
  transform: rotateX(180deg);
}

.card-content {
  padding: 16px;
  text-align: center;
}

.card-controls {
  display: flex;
  gap: 16px;
}

/* Анимации для переключения карточек */
.next-enter-active,
.next-leave-active,
.prev-enter-active,
.prev-leave-active {
  transition: all 0.2s ease-in-out;
}

.next-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.next-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.prev-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.prev-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.next-enter-to,
.next-leave-from,
.prev-enter-to,
.prev-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
