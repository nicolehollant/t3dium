import { GetServerSideProps, NextPage } from 'next'
import { BuiltInProviderType } from 'next-auth/providers'
import {
  signIn,
  getCsrfToken,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import LoginButton from '../../components/login-button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Icons: Record<string, JSX.Element> = {
  Email: <FontAwesomeIcon icon={faPaperPlane} size="lg" />,
  GitHub: <FontAwesomeIcon icon={faGithub} size="lg" />,
  Twitter: <FontAwesomeIcon icon={faTwitter} size="lg" />,
}

interface SignInProps {
  csrfToken?: string
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null
}

const SigninForm: FC<SignInProps> = ({ csrfToken, providers }) => {
  const [email, setEmail] = useState('')
  const {
    query: { callbackUrl },
  } = useRouter()
  return (
    <div className="mx-auto flex h-max max-w-md flex-col gap-8 rounded-xl bg-emerald-50/80 py-6 px-8 shadow">
      <h1 className="text-2xl font-semibold">Sign In</h1>
      <div className="grid gap-8">
        <form
          method="post"
          action="/api/auth/signin/email"
          className="grid gap-3"
        >
          <div>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              onInput={(e: any) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg shadow-sm transition duration-200 hover:shadow-md focus:border-emerald-600 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
            />
          </div>
          <button
            className="flex w-full items-center justify-between rounded-lg bg-emerald-600 px-4 py-2 text-center text-lg font-semibold text-emerald-50 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-75"
            disabled={!email}
          >
            <span>Sign in with Email</span>
            {Icons.Email}
          </button>
        </form>
        <div className="relative">
          <hr />
          <div className="leading-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded bg-emerald-50 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-700/80">
            OR
          </div>
        </div>
        <div className="space-y-3">
          {providers &&
            Object.values(providers)
              .filter((provider) => provider.name !== 'Email')
              .map((provider) => (
                <div key={provider.name}>
                  <button
                    onClick={() =>
                      signIn(provider.id, {
                        callbackUrl: Array.isArray(callbackUrl)
                          ? callbackUrl[0]
                          : callbackUrl ?? '/',
                      })
                    }
                    className="flex w-full items-center justify-between rounded-lg bg-emerald-600 px-4 py-2 text-center text-lg font-semibold text-emerald-50 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-75"
                  >
                    <span>Sign in with {provider.name} </span>
                    {provider.name in Icons && Icons[provider.name]}
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}

const SigninPage: NextPage<SignInProps> = ({ csrfToken, providers }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 flex items-center justify-between gap-4 border-b border-b-gray-400 bg-emerald-200/60 px-4 py-2 shadow backdrop-blur backdrop-filter">
        <h1 className="text-center text-3xl font-extrabold">
          <Link href="/">📚 T3dium</Link>
        </h1>
        <LoginButton showSignInButton={false}></LoginButton>
      </header>
      <div className="my-auto pb-[16vh] pt-8">
        <SigninForm providers={providers} csrfToken={csrfToken} />
      </div>
    </div>
  )
}

export default SigninPage

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  return {
    props: {
      providers,
      csrfToken,
    },
  }
}
