import Link from 'next/link';
import React from 'react';
import { Icons } from './Icons';
import { getAuthSession } from '@/lib/auth';
import UserAccountNav from './UserAccountNav';
import SearchBar from './SearchBar';
import ThemeToggle from './theme-toggle';
import { buttonVariants } from './ui/button';

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <header className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-10 py-2 dark:bg-zinc-900 dark:border-zinc-700 ">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-bold md:block">Keddit</p>
        </Link>

        <SearchBar />

        <div className="flex items-center space-x-4 shrink-0">
          <ThemeToggle />

          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <div className="flex space-x-2 shrink-0">
              <Link
                className={buttonVariants({
                  size: 'sm',
                })}
                href="/sign-in"
              >
                로그인
              </Link>
              <Link
                className={buttonVariants({
                  size: 'sm',
                })}
                href="/sign-up"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
