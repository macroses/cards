import type { Session, User } from 'next-auth'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

const runtimeConfig = useRuntimeConfig()
const prisma = new PrismaClient()

export default NuxtAuthHandler({
  secret: runtimeConfig.API_ROUTE_SECRET,
  pages: {
    signIn: '/login',
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: User }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }: { session: Session, token: any }) {
      if (session?.user) {
        session.user.id = token.id
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
    // @ts-expect-error description
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Отсутствуют учетные данные')
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.password) {
            throw new Error('Пользователь не найден')
          }

          const isValid = await argon2.verify(user.password, credentials.password)

          if (!isValid) {
            throw new Error('Неверный пароль')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        }
        catch (error: any) {
          console.error('Ошибка авторизации:', error)
          return null
        }
      },
    }),
  ],
})
