import type { Session, User } from 'next-auth'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const runtimeConfig = useRuntimeConfig()
const prisma = new PrismaClient()

export default NuxtAuthHandler({
  secret: 'my-superb-secret',
  pages: {
    signIn: '/login',
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({ session, user }: { session: Session, user: User }) => {
      if (session?.user) {
        session.user.id = user.id
      }

      return session
    },
    async signIn({ account, profile }: { account: any, profile: any }) {
      if (account?.provider === 'google') {
        return profile.email_verified && profile.email.endsWith('@gmail.com')
      }

      return true
    },
  },
  providers: [
    // @ts-expect-error description
    GithubProvider.default({
      clientId: runtimeConfig.public.GITHUB_CLIENT_ID,
      clientSecret: runtimeConfig.GITHUB_CLIENT_SECRET,
    }),
    // @ts-expect-error description
    GoogleProvider.default({
      clientId: runtimeConfig.public.GOOGLE_CLIENT_ID,
      clientSecret: runtimeConfig.GOOGLE_CLIENT_SECRET,
    }),
    // Добавляем провайдер для email/password
    CredentialsProvider.default({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw createError({
            statusCode: 400,
            message: 'Необходимо указать email и пароль',
          })
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw createError({
            statusCode: 401,
            message: 'Неверный email или пароль',
          })
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        )

        if (!isValidPassword) {
          throw createError({
            statusCode: 401,
            message: 'Неверный email или пароль',
          })
        }

        return user
      },
    }),
  ],
})
