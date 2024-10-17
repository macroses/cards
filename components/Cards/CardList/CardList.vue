<script lang="ts" setup>
import dayjs from 'dayjs'
import type { Card } from '~/types/Card'

const props = defineProps<{
  cards: Card[]
}>()

const emit = defineEmits<{
  (e: 'deleteCard', cardId: string): void
  (e: 'updateCard', cardId: string, updatedCard: Partial<Card>): void
}>()

const sortedCards = computed(() => {
  return [...props.cards].sort((a, b) => {
    if (!a.nextReviewAt && !b.nextReviewAt)
      return 0
    if (!a.nextReviewAt)
      return 1
    if (!b.nextReviewAt)
      return -1
    return dayjs(a.nextReviewAt).diff(dayjs(b.nextReviewAt))
  })
})
</script>

<template>
  <ul v-if="sortedCards.length > 0">
    <CardItem
      v-for="card in sortedCards"
      :key="card.id"
      :card="card"
      @delete="emit('deleteCard', card.id)"
      @update="(updatedCard) => emit('updateCard', card.id, updatedCard)"
    />
  </ul>
  <p v-else>
    В этом модуле пока нет карточек.
  </p>
</template>

<style scoped src="./style.css" />
