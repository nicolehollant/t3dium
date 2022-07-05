import { FC } from 'react'
import AppHeader from './app-header'

const LoadingPageShell: FC = () => {
  return (
    <div className="flex flex-col">
      <AppHeader />
      <p className="mx-auto w-max p-8 text-gray-400">loading...</p>
    </div>
  )
}

export default LoadingPageShell
