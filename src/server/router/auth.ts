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
          OR: [
            { id: (session?.user as any)?.id },
            { email: session?.user?.email },
          ],
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
      console.log({ session })
      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            { id: (session?.user as any)?.id },
            { email: session?.user?.email },
          ],
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
      if (!session || (!session.user?.email && !(session.user as any)?.id)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'No active session',
        })
      }
      const user = await ctx.prisma.user.updateMany({
        where: {
          OR: [
            { id: (session?.user as any)?.id },
            { email: session?.user?.email },
          ],
        },
        data: {
          name: input.name,
        },
      })
      return user
    },
  })
