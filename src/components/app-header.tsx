import Link from "next/link";
import { FC } from "react";
import LoginButton from "./login-button";

const AppHeader: FC<{ children?: JSX.Element | JSX.Element[] }> = ({children}) => {
  return <>
    <header className="flex justify-between px-4 items-center gap-4 py-2 border-b border-b-gray-400 bg-emerald-200/60 backdrop-filter backdrop-blur sticky top-0 shadow">
      <h1 className="font-extrabold text-center text-3xl">
        <Link href='/'>
          📚 T3dium
        </Link>
      </h1>
      <LoginButton></LoginButton>
    </header>
    {children}
  </>
}

export default AppHeader