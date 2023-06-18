'use client';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { signIn } from 'next-auth/react';
import { Icons } from './Icons';
import { toast } from 'react-hot-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      toast.error('구글 로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size={'sm'}
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="w-4 h-4 mr-2" />}
        Google
      </Button>
    </div>
  );
}
