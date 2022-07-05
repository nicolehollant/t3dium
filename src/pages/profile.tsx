import type { NextPage } from 'next'
import Head from 'next/head'
import { trpc } from '../utils/trpc'
import AppHeader from '../components/app-header'
import LoadingPageShell from '../components/loading-page-shell'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Avatar from '../components/avatar'
import { toast } from 'react-toastify'

const Profile: NextPage = () => {
  const router = useRouter()
  const user = trpc.useQuery(['auth.user'])
  const [name, setName] = useState('')
  const [success, setSuccess] = useState(false)
  const updateUser = trpc.useMutation('auth.updateUser')

  const submit = async () => {
    await updateUser.mutateAsync({
      name,
    })
    user.refetch()
  }

  useEffect(() => {
    setName(user.data?.name ?? '')
  }, [user.data])
  useEffect(() => {
    if (updateUser.isSuccess) {
      toast('Updated name', {
        type: 'success',
        // position: toast.POSITION.BOTTOM_RIGHT,
      })
    }
  }, [updateUser.isSuccess])

  if (user.isLoading) {
    return <LoadingPageShell />
  } else if (user.isError) {
    router.push('/')
    return null
  }
  if (!user.data) {
    router.push('/')
    return null
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col">
        <AppHeader>
          <div className="flex items-center justify-between border-b border-b-gray-400 bg-emerald-200/60 py-12 px-4 backdrop-blur backdrop-filter">
            <p className="text-xl">Profile</p>
            <button
              onClick={() => signOut().then(() => router.push('/'))}
              className="rounded-lg bg-emerald-600 px-2 py-1 text-base font-semibold text-emerald-50"
            >
              Sign Out
            </button>
          </div>
        </AppHeader>
        <section className="mx-auto mt-8 max-w-2xl space-y-6">
          <div className="flex items-center gap-4">
            <p className="text-lg text-gray-800/80">
              Signed in as{' '}
              <span className="font-semibold">{user.data.email}</span>
            </p>
            <Avatar size="sm" id={user.data.id} image={user.data.image} />
          </div>
          <label className="block space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Name
            </p>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg shadow-sm transition duration-200 hover:shadow-md focus:border-emerald-600 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              type="text"
              placeholder="name"
              value={name}
              onInput={(e: any) => setName(e.target?.value ?? name)}
            />
          </label>
          <button
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-center text-lg font-semibold text-emerald-50 disabled:cursor-not-allowed disabled:bg-opacity-30 disabled:text-opacity-75"
            onClick={submit}
            disabled={!name || name === user.data.name || updateUser.isLoading}
          >
            {updateUser.isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </section>
      </div>
    </>
  )
}

export default Profile
