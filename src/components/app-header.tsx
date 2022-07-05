import Link from 'next/link'
import { FC } from 'react'
import LoginButton from './login-button'

const AppHeader: FC<{ children?: JSX.Element | JSX.Element[] }> = ({
  children,
}) => {
  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-b-gray-400 bg-emerald-200/60 px-4 py-2 shadow backdrop-blur backdrop-filter">
        <h1 className="text-center text-3xl font-extrabold">
          <Link href="/">📚 T3dium</Link>
        </h1>
        <LoginButton showSignInButton={true}></LoginButton>
      </header>
      {children}
    </>
  )
}

export default AppHeader
