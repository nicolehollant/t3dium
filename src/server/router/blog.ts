import { createRouter } from './context'
import { z } from 'zod'
import { getSession } from 'next-auth/react'
import slugify from 'slugify'
import { nanoid } from 'nanoid'
import { TRPCError } from '@trpc/server'

const basePost = {
  author: z.object({
    id: z.string(),
    name: z.string().nullish(),
    image: z.string().nullish(),
  }),
  slug: z.string(),
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  createTime: z.date(),
  lastUpdatedTime: z.date(),
}
const Post = z.object({
  ...basePost,
  content: z.string(),
})
const Posts = z.array(z.object(basePost))

export const blogRouter = createRouter()
  .query('getOne', {
    input: z.string(),
    async resolve({ ctx, input }) {
      let userID = null
      const session = await getSession({ req: ctx.req }).catch(() => {})
      if (session && session.user) {
        const user = await ctx.prisma.user.findFirst({
          where: {
            OR: [
              { id: (session?.user as any)?.id },
              { email: session?.user?.email },
            ],
          },
        })
        userID = user?.id
      }
      const post = await ctx.prisma.posts.findFirst({
        where: {
          OR: [{ id: input }, { slug: input }],
        },
        select: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          id: true,
          title: true,
          tagline: true,
          slug: true,
          content: true,
          createTime: true,
          lastUpdatedTime: true,
        },
      })
      if (!post) {
        return undefined
      }
      return {
        ...post,
        isOwnPost: post?.author.id && userID === post.author.id,
      }
    },
  })
  .query('getAll', {
    async resolve({ ctx }) {
      const posts = await ctx.prisma.posts.findMany({
        select: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          id: true,
          title: true,
          tagline: true,
          slug: true,
          createTime: true,
          lastUpdatedTime: true,
        },
      })
      return posts
    },
  })
  .query('getAuthor', {
    input: z.string(),
    async resolve({ ctx, input }) {
      let userID = null
      const session = await getSession({ req: ctx.req }).catch(() => {})
      if (session && session.user) {
        const user = await ctx.prisma.user.findFirst({
          where: {
            OR: [
              { id: (session?.user as any)?.id },
              { email: session?.user?.email },
            ],
          },
        })
        userID = user?.id
      }
      const author = await ctx.prisma.user.findFirst({
        where: {
          OR: [{ id: input }, { email: input }, { name: input }],
        },
        select: {
          id: true,
          name: true,
          image: true,
          Posts: {
            select: {
              id: true,
              title: true,
              tagline: true,
              slug: true,
              createTime: true,
              lastUpdatedTime: true,
            },
          },
        },
      })
      if (!author) {
        return undefined
      }
      return {
        ...author,
        isCurrentUser: author?.id && userID === author.id,
      }
    },
  })
  .mutation('createPost', {
    input: z.object({
      title: z.string(),
      content: z.string(),
      tagline: z.string(),
    }),
    async resolve({ ctx, input }) {
      const session = await getSession({ req: ctx.req })
      if (!session || !session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated 🤨',
        })
      }
      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            { id: (session?.user as any)?.id },
            { email: session?.user?.email },
          ],
        },
      })
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found 🤨',
        })
      }
      const post = await ctx.prisma.posts.create({
        data: {
          createTime: new Date(),
          lastUpdatedTime: new Date(),
          content: input.content,
          title: input.title,
          tagline: input.tagline,
          poster: '',
          slug: slugify([input.title, nanoid(5)].join(' ')),
          userId: user.id,
        },
      })
      return post
    },
  })
  .mutation('editPost', {
    input: z.object({
      postID: z.string(),
      title: z.string().optional(),
      content: z.string().optional(),
      tagline: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const session = await getSession({ req: ctx.req })
      if (!session || !session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated 🤨',
        })
      }
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: session.user.email,
        },
      })
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found 🤨',
        })
      }
      const existingPost = await ctx.prisma.posts.findFirst({
        where: {
          AND: [
            { id: input.postID },
            {
              author: {
                id: user.id,
              },
            },
          ],
        },
      })
      if (!existingPost) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Post does not belong to you',
        })
      }
      const post = await ctx.prisma.posts.update({
        where: {
          id: input.postID,
        },
        data: {
          lastUpdatedTime: new Date(),
          content: input.content,
          title: input.title,
          tagline: input.tagline,
          slug:
            input.title && input.title !== existingPost.title
              ? slugify([input.title, nanoid(5)].join(' '))
              : undefined,
        },
      })
      return post
    },
  })
  .mutation('deletePost', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const session = await getSession({ req: ctx.req })
      if (!session || !session.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated 🤨',
        })
      }
      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            { id: (session?.user as any)?.id },
            { email: session?.user?.email },
          ],
        },
      })
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found 🤨',
        })
      }
      const existingPost = await ctx.prisma.posts.findFirst({
        where: {
          AND: [
            { id: input },
            {
              author: {
                id: user.id,
              },
            },
          ],
        },
      })
      if (!existingPost) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Post does not belong to you',
        })
      }
      const post = await ctx.prisma.posts.delete({
        where: {
          id: input,
        },
      })
      return post
    },
  })

export type Post = z.infer<typeof Post>
export type Posts = z.infer<typeof Posts>
