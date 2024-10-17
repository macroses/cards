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

const nextCard = () => {
  if (currentIndex.value < props.cards.length - 1) {
    direction.value = 'next'
    currentIndex.value++
    showAnswer.value = false
  }
}

const prevCard = () => {
  if (currentIndex.value > 0) {
    direction.value = 'prev'
    currentIndex.value--
    showAnswer.value = false
  }
}

const toggleAnswer = () => {
  showAnswer.value = !showAnswer.value
}

const rateCard = async (quality: number) => {
  if (!currentCard.value)
    return

  try {
    await $fetch('/api/cards/review', {
      method: 'POST',
      body: { cardId: currentCard.value.id, quality },
    })
    nextCard()
  }
  catch (error) {
    console.error('Ошибка при оценке карточки:', error)
  }
}
</script>

<template>
  <div class="card-slider">
    <Transition
        :name="direction"
        mode="out-in"
    >
      <div
          :key="currentIndex"
          class="card-container"
      >
        <div
            class="card"
            :class="{ 'is-flipped': showAnswer }"
            @click="toggleAnswer"
        >
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
      <div v-if="showAnswer" class="rating-buttons">
        <TheButton v-for="i in 5" :key="i" @click="rateCard(i)">
          {{ i }}
        </TheButton>
      </div>
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

<style src="./style.css"/>
