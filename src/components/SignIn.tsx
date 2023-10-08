import React from 'react';
import { Icons } from './Icons';
import Link from 'next/link';
import UserAuthForm from './UserAuthForm';

export default function SignIn() {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center text-zinc-700">
        <Icons.logo className="w-6 h-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tighter">로그인</h1>
        <p className="text-sm max-w-xs mx-auto text-start">
          K-reddit은 소셜 인증만 지원합니다.
        </p>

        {/* sign in form - client component */}
        <UserAuthForm className="" />

        <p className="px-8 text-center text-sm text-zinc-700">
          K-reddit에 처음이신가요?{' '}
          <Link
            href="/sign-up"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
