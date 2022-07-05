import { FC } from 'react'
import Link from 'next/link'
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'
import Avatar from './avatar'

const Wrapper: FC<{
  asLink?: boolean
  id?: string | null
  children?: JSX.Element | JSX.Element[]
}> = ({ asLink, id, children }) => {
  if (asLink) {
    return (
      <Link href={`/author/${id}`}>
        <a className="group flex items-center gap-4">{children}</a>
      </Link>
    )
  }
  return <div className="flex items-center gap-4">{children}</div>
}

const AuthorPreview: FC<{
  name?: string | null
  asLink?: boolean
  largeName?: boolean
  image?: string | null
  id: string
  size?: 'base' | 'sm' | 'xs'
}> = ({ name, image, id, asLink, size, largeName }) => {
  size = size ?? 'base'
  const nameFromSeed: string =
    uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      seed: id,
    }) + `-${id.substring(0, 3)}`
  return (
    <Wrapper asLink={asLink} id={id}>
      <Avatar image={image} id={id} size={size} />
      <p
        className={`group-hover:text-emerald-900 group-hover:underline ${
          largeName ? 'text-lg' : 'text-sm'
        }`}
      >
        {name ?? nameFromSeed}
      </p>
    </Wrapper>
  )
}

export default AuthorPreview
