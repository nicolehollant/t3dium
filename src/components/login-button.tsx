import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FC } from 'react'
import { trpc } from '../utils/trpc'
import Avatar from './avatar'

const LoginButton: FC<{ showSignInButton?: boolean }> = ({
  showSignInButton,
}) => {
  const user = trpc.useQuery(['auth.user'])
  if (user.data) {
    return (
      <Link href="/profile">
        <a className="rounded-full shadow-md">
          <Avatar id={user.data.id} size="sm" image={user.data.image} />
        </a>
      </Link>
    )
  } else if (showSignInButton) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => signIn()}
          className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
        >
          Sign In
        </button>
      </div>
    )
  }
  return null
}
export default LoginButton
