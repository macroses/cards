import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неавторизованный доступ',
    })
  }

  const userId = session.user.id

  try {
    const modules = await prisma.module.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { cards: true },
        },
      },
    })

    return modules.map(module => ({
      ...module,
      cardCount: module._count.cards,
    }))
  }
  catch (error) {
    console.error('Ошибка при получении модулей:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при получении модулей, хаха',
    })
  }
})
