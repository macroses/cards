import { useToast } from '~/components/ui/toast/use-toast'
import { type Card } from "@/types/Cards/Index"

export function useCards () {
	const { toast } = useToast()
	
	const cards = ref<Card[]>([])
	
	const fetchCards = async (moduleId: string) => {
		try {
			cards.value = await $fetch<Card[]>(`/api/cards/cards`, {
				query: { moduleId: moduleId }
			})
		} catch (error) {
			console.error('Ошибка при получении карточек:', error)
			toast({ variant: "destructive", description: 'Ошибка при получении карточек' })
		}
	}
	
	const createCard = async (cardData: Partial<Card>, moduleId: string) => {
		try {
			const newCard = await $fetch('/api/cards/cards', {
				method: 'POST',
				body: { ...cardData, moduleId }
			})
			
			toast({ description: 'Карточка успешно создана' })
			cards.value.push(newCard as Card)
			return newCard
		} catch (error) {
			console.error('Ошибка при создании карточки:', error)
			toast({ variant: "destructive", description: 'Ошибка при создании карточки' })
			return null
		}
	}

	const deleteCard = async (cardId: string) => {
		try {
		  await $fetch(`/api/cards/${cardId}`, {
			method: 'DELETE'
		  })
		  
		  toast({ description: 'Карточка успешно удалена' })
		  cards.value = cards.value.filter(card => card.id !== cardId)
		} catch (error) {
		  console.error('Ошибка при удалении карточки:', error)
		  toast({ variant: "destructive", description: 'Ошибка при удалении карточки' })
		}
	}
	  
	return {
		cards,
		fetchCards,
		createCard,
		deleteCard
	}
}