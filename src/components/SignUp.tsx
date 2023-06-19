import React from 'react';
import UserAuthForm from './UserAuthForm';
import Link from 'next/link';
import { Icons } from './Icons';

export default function SignUp() {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">회원가입</h1>
        <p className="text-sm max-w-xs mx-auto">
          계속 진행하면 K-reddit 계정이 생성되며, K-reddit의 사용자 계약 및
          개인정보 보호정책에 동의하게 됩니다.
        </p>
      </div>
      <UserAuthForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{' '}
        <Link
          href="/sign-in"
          className="hover:text-brand text-sm underline underline-offset-4"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
