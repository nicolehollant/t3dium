import { FC, useCallback, useState } from 'react'
import MarkdownEditor from './editor/markdown-editor'

interface Post {
  title: string
  tagline: string
  content: string
}
interface Props {
  isEditing?: boolean
  isSubmitting?: boolean
  isDeleting?: boolean
  onSubmit: (post: Post) => void
  onDelete?: () => void
  post?: Partial<Post>
}

const PostEditor: FC<Props> = ({
  isEditing,
  onSubmit,
  onDelete,
  post,
  isSubmitting,
  isDeleting,
}) => {
  const [content, setContent] = useState(post?.content ?? '')
  const [tagline, setTagline] = useState(post?.tagline ?? '')
  const [title, setTitle] = useState(post?.title ?? '')
  const [didSetOwnTitle, setDidSetOwnTitle] = useState(!(isEditing ?? false))

  const handleDocChange = useCallback(
    (newDoc: string) => {
      setContent(newDoc)
      if (isEditing) return
      const _title = newDoc.split('\n').find((a) => a.startsWith('# '))
      if ((!title && _title) || (!didSetOwnTitle && _title)) {
        setTitle(_title.replace('# ', '').trim())
        setDidSetOwnTitle(false)
      }
    },
    [title, didSetOwnTitle]
  )

  return (
    <section className="mx-auto mt-8 w-full max-w-prose space-y-4 px-4 sm:text-lg lg:text-xl">
      <label className="block space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Title
        </p>
        <input
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg shadow-sm transition duration-200 hover:shadow-md focus:border-emerald-600 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
          type="text"
          value={title}
          onInput={(e: any) => {
            setDidSetOwnTitle(true)
            setTitle(e.target?.value ?? title)
          }}
        />
      </label>
      <label className="block space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Tagline
        </p>
        <input
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg shadow-sm transition duration-200 hover:shadow-md focus:border-emerald-600 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
          type="text"
          value={tagline}
          onInput={(e: any) => setTagline(e.target?.value ?? tagline)}
        />
      </label>
      <label className="block space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Content
        </p>
        <MarkdownEditor
          minHeight="10rem"
          maxHeight="50vh"
          className="overflow-hidden rounded-lg border border-gray-300 text-lg shadow-sm transition duration-200 focus-within:border-emerald-600 focus-within:ring focus-within:ring-emerald-500 focus-within:ring-opacity-50 hover:shadow-md focus:border-emerald-600 focus:ring  focus:ring-emerald-500 focus:ring-opacity-50"
          value={content}
          onChange={handleDocChange}
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-lg font-semibold text-emerald-50 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-75"
          onClick={() => {
            onSubmit({
              content,
              tagline,
              title,
            })
          }}
          disabled={
            !content || !tagline || !title || isSubmitting || isDeleting
          }
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {isEditing && (
          <button
            className="w-max rounded-lg bg-rose-600 px-4 py-2 text-center text-lg font-semibold text-rose-50 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-75"
            onClick={onDelete}
            disabled={isSubmitting || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </section>
  )
}
export default PostEditor
