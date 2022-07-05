import { FC } from 'react'
import { generateFromString } from 'generate-avatar'
import Image from 'next/image'

const Avatar: FC<{
  image?: string | null
  id: string
  size?: 'base' | 'sm' | 'xs'
}> = ({ image, id, size }) => {
  size = size ?? 'base'
  const svg = generateFromString(id!)

  if (image) {
    return (
      <div
        className={
          {
            base: 'h-8 w-8 sm:h-10 sm:w-10',
            sm: 'h-8 w-8',
            xs: 'h-6 w-6',
          }[size] +
          ' relative overflow-hidden rounded-full border border-transparent shadow group-hover:border-emerald-200 group-hover:shadow-lg group-hover:ring group-hover:ring-emerald-600/75'
        }
      >
        <Image alt="" layout="fill" src={image} />
      </div>
    )
  }
  return (
    <div
      className={
        {
          base: 'h-8 w-8 sm:h-10 sm:w-10',
          sm: 'h-8 w-8',
          xs: 'h-6 w-6',
        }[size] +
        ' relative overflow-hidden rounded-full border border-transparent shadow group-hover:border-emerald-200 group-hover:shadow-lg group-hover:ring group-hover:ring-emerald-600/75'
      }
    >
      <Image alt="" src={`data:image/svg+xml;utf8,${svg}`} layout="fill" />
    </div>
  )
}

export default Avatar
