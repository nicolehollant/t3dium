import { createRouter } from './context'
import { z } from 'zod'
import { getSession } from 'next-auth/react'
import { TRPCError } from '@trpc/server'

export const authRouter = createRouter()
  .query('restricted', {
    async resolve({ ctx }) {
      const session = await getSession({ req: ctx.req })
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: session?.user?.email,
        },
      })
      if (session) {
        return {
          message: 'Yay youre authenticated',
          session,
          user,
        }
      }
      return {
        message: 'Not authenticated 🤨',
      }
    },
  })
  .query('user', {
    async resolve({ ctx }) {
      const session = await getSession({ req: ctx.req })
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: session?.user?.email,
        },
      })
      if (!session || !user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No active session',
        })
      }
      return user!
    },
  })
  .mutation('updateUser', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      const session = await getSession({ req: ctx.req })
      if (!session || !session.user?.email) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No active session',
        })
      }
      const user = await ctx.prisma.user.update({
        where: {
          email: session.user.email!,
        },
        data: {
          name: input.name,
        },
      })
      return user
    },
  })
