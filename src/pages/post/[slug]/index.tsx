import type { NextPage } from 'next'
import Head from 'next/head'
import { trpc } from '../../../utils/trpc'
import { useRouter } from 'next/router'
import MarkdownPreview from '../../../components/editor/markdown-preview'
import AppHeader from '../../../components/app-header'
import Link from 'next/link'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import AuthorPreview from '../../../components/author-preview'
import LoadingPageShell from '../../../components/loading-page-shell'

dayjs.extend(localizedFormat)

const ViewPost: NextPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const post = trpc.useQuery([
    'blog.getOne',
    (Array.isArray(slug) ? slug[0] : slug ?? '') as string,
  ])
  const deletePostMutation = trpc.useMutation(['blog.deletePost'])

  const deletePost = async () => {
    const deletedPost = await deletePostMutation.mutateAsync(post.data!.id)
    if (deletedPost) {
      router.push('/')
    }
  }

  const removeHeaderIfDuplicate = (_post: typeof post) => {
    const parsedTitle = _post.data?.content
      .split('\n')
      .find((a) => a.startsWith('# '))
      ?.replace('# ', '')
      .trim()
    if (post.data?.title === parsedTitle) {
      return _post.data!.content.replace(`# ${parsedTitle}`, '')
    }
    return _post.data?.content ?? ''
  }

  if (!post.data) {
    return <LoadingPageShell />
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col">
        <AppHeader>
          <div className="flex items-center justify-between border-b border-b-gray-400 bg-emerald-200/60 py-6 px-4 backdrop-blur backdrop-filter">
            <AuthorPreview
              name={post.data.author.name}
              asLink={true}
              id={post.data.author.id!}
              image={post.data.author.image}
              size="sm"
              largeName={true}
            />
            {post.data.isOwnPost && (
              <div className="flex items-center gap-2">
                <Link href={`/post/${post.data.id}/edit`}>
                  <a className="rounded-lg bg-emerald-600 px-2 py-1 text-base font-semibold text-emerald-50">
                    Edit Post
                  </a>
                </Link>
                <button
                  onClick={deletePost}
                  className="rounded-lg bg-rose-600 px-2 py-1 text-center text-base font-semibold text-rose-50"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </AppHeader>
        {post.isSuccess && (
          <article className="mx-auto max-w-prose py-12">
            <h2 className="text-7xl">{post.data.title}</h2>
            <p className="mt-6 ml-2 border-l-2 border-emerald-200/50 pl-4 text-lg italic text-gray-500">
              {post.data.tagline}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <AuthorPreview
                name={post.data.author.name}
                asLink={true}
                id={post.data.author.id!}
                image={post.data.author.image}
                largeName={true}
                size="base"
              />
              <span className="text-gray-400">&middot;</span>
              <time className="text-sm text-gray-600">
                {dayjs(post.data.createTime).format('l')}
              </time>
            </div>
            <hr className="my-12" />
            <MarkdownPreview
              className="prose prose-lg"
              value={removeHeaderIfDuplicate(post)}
            />
          </article>
        )}
      </div>
    </>
  )
}

export default ViewPost