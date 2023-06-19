import React from 'react';
import { Icons } from './Icons';
import Link from 'next/link';
import UserAuthForm from './UserAuthForm';

export default function SignIn() {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="w-6 h-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tighter">
          Welcome Back
        </h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing, you ar setting up a keddit account and agree to our
          User Agreement and Privacy Policy.
        </p>

        {/* sign in form - client component */}
        <UserAuthForm className="" />

        <p className="px-8 text-center text-sm text-zinc-700">
          New to Keddit?{' '}
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