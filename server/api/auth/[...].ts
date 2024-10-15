import type { Session, User } from 'next-auth'
// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
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
    async signIn({ account, profile }) {
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
  ],
})
