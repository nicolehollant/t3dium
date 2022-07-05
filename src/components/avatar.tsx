import { FC } from 'react'
import { generateFromString } from 'generate-avatar'

const Avatar: FC<{
  image?: string | null
  id: string
  size?: 'base' | 'sm' | 'xs'
}> = ({ image, id, size }) => {
  size = size ?? 'base'
  const svg = generateFromString(id!)

  if (image) {
    return (
      <img
        src={image}
        className={`${
          {
            base: 'h-10 w-10',
            sm: 'h-8 w-8',
            xs: 'h-6 w-6',
          }[size]
        } rounded-full border border-transparent shadow group-hover:border-emerald-200 group-hover:shadow-lg group-hover:ring group-hover:ring-emerald-600/75`}
      />
    )
  }
  return (
    <img
      src={`data:image/svg+xml;utf8,${svg}`}
      className={`${
        {
          base: 'h-10 w-10',
          sm: 'h-8 w-8',
          xs: 'h-6 w-6',
        }[size]
      } rounded-full border border-transparent shadow group-hover:border-emerald-200 group-hover:shadow-lg group-hover:ring group-hover:ring-emerald-600/75`}
    />
  )
}

export default Avatar
