export interface Card {
	question: string;
	answer: string;
	title: string;
	tags: string;
	partOfSpeech: string;
	exampleSentence: string;
	id: string;
	moduleId: string;
	createdAt: string;
}

export function useCards () {
	
	const cards = ref<Card[]>([])
	
	const fetchCards = async (moduleId: string) => {
		try {
			cards.value = await $fetch<Card[]>(`/api/cards/cards`, {
				query: { moduleId: moduleId }
			})
		} catch (error) {
			console.error('Ошибка при получении карточек:', error)
			console.log({
				variant: "destructive",
				description: 'Ошибка при получении карточек'
			})
		}
	}
	
	const createCard = async (cardData: Partial<Card>, moduleId: string) => {
		try {
			const newCard = await $fetch('/api/cards/cards', {
				method: 'POST',
				body: { ...cardData, moduleId }
			})
			
			console.log({ description: 'Карточка успешно создана' })
			
			cards.value.push(newCard as Card)
			
			return newCard
		} catch (error) {
			console.error('Ошибка при создании карточки:', error)
			
			console.log({
				variant: "destructive",
				description: 'Ошибка при создании карточки'
			})
			
			return null
		}
	}

	const deleteCard = async (cardId: string) => {
		try {
		  await $fetch(`/api/cards/${cardId}`, {
			method: 'DELETE'
		  })
			
			console.log({ description: 'Карточка успешно удалена' })
			
		  cards.value = cards.value.filter(card => card.id !== cardId)
		} catch (error) {
		  console.error('Ошибка при удалении карточки:', error)
			console.log({
				variant: "destructive",
				description: 'Ошибка при удалении карточки'
			})
		}
	}

	const updateCard = async (cardId: string, cardData: Partial<Card>) => {
		try {
		  const updatedCard = await $fetch(`/api/cards/${cardId}`, {
				method: 'PATCH',
				body: cardData
		  })
			
			console.log({ description: 'Карточка успешно обновлена' })
			
		  const index = cards.value.findIndex(card => card.id === cardId)
			
		  if (index !== -1) {
				cards.value[index] = updatedCard as Card
		  }
			
		  return updatedCard
		} catch (error) {
		  console.error('Ошибка при обновлении карточки:', error)
			console.log({
				variant: "destructive",
				description: 'Ошибка при обновлении карточки'
			})
			
		  return null
		}
	}
	  
	return {
		cards,
		fetchCards,
		createCard,
		deleteCard,
		updateCard
	}
}