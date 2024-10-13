import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const userId = query.userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID пользователя обязателен',
    })
  }

  try {
    const modules = await prisma.module.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { cards: true }
        }
      }
    })
    
    return modules.map(module => ({
      ...module,
      cardCount: module._count.cards
    }))
  } catch (error) {
    console.error('Ошибка при получении модулей:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении модулей',
    })
  }
})