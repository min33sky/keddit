'use client';

import { cn } from '@/lib/utils';
import { UsernameValidator } from '@/lib/validators/username';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/Card';
import { Label } from './ui/Label';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'id' | 'username'>;
}

type FormData = z.infer<typeof UsernameValidator>;

export default function UserNameForm({
  user,
  className,
  ...props
}: UserNameFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  });

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: FormData) => {
      const payload: FormData = {
        name,
      };

      const { data } = await axios.patch('/api/username', payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast.error('이미 존재하는 사용자 이름입니다.');
        }
      }

      toast.error('알 수 없는 오류가 발생했습니다.');
    },
    onSuccess: () => {
      startTransition(() => {
        toast.success('사용자 이름이 변경되었습니다.');
        router.refresh();
      });
    },
  });

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) => updateUsername(e))}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>현재 사용자 이름</CardTitle>
          <CardDescription>마음에 드는 이름을 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              이름
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register('name')}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading} disabled={isLoading}>
            이름 변경
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
