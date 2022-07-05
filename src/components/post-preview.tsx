import Link from 'next/link'
import { FC } from 'react'
import { Posts } from '../server/router/blog'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import AuthorPreview from './author-preview'

dayjs.extend(localizedFormat)

const PostPreview: FC<{
  post: Pick<
    Posts[number],
    'title' | 'slug' | 'tagline' | 'author' | 'createTime'
  >
}> = ({ post }) => (
  <Link href={`/post/${post.slug}`}>
    <a className="block w-full transform rounded-xl bg-emerald-50/50 shadow transition duration-200 hover:scale-[1.02] hover:bg-emerald-50/20 hover:shadow-lg">
      <div className="group px-4 py-4">
        <h2 className="text-xl font-semibold transition duration-200 group-hover:text-emerald-700">
          {post.title}
        </h2>
        <p className="mt-2 text-sm duration-200 line-clamp-1 group-hover:text-emerald-800">
          {post.tagline}
        </p>
      </div>
      <hr className="-mx-4 px-4 opacity-50" />
      <Link href={`/author/${post.author.id}`}>
        <a className="group flex items-center gap-4 px-4 py-4">
          <AuthorPreview
            name={post.author.name!}
            image={post.author.image}
            id={post.author.id}
            size="sm"
          />
          <span className="text-gray-400">&middot;</span>
          <time className="text-sm text-gray-600">
            {dayjs(post.createTime).format('l')}
          </time>
        </a>
      </Link>
    </a>
  </Link>
)

export default PostPreview
