'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  CreateSubredditPayload,
  SubredditValidator,
} from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';

export default function CreatePage() {
  const router = useRouter();
  const form = useForm<CreateSubredditPayload>({
    resolver: zodResolver(SubredditValidator),
    defaultValues: {
      name: '',
    },
  });

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async (payload: CreateSubredditPayload) => {
      const { data } = await axios.post('/api/subreddit', payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast.error('이미 존재하는 커뮤니티 이름입니다.');
        }

        if (err.response?.status === 422) {
          toast.error('커뮤니티 이름은 3글자 이상 21글자 이하여야 합니다.');
        }

        if (err.response?.status === 401) {
          toast.error('로그인이 필요합니다.');
        }
      } else {
        toast.error('서버에 문제가 발생했습니다.');
      }
    },
    onSuccess: (data) => {
      toast.success('커뮤니티 생성 성공! 잠시 후 이동합니다.');
      router.push(`/r/${data}`);
    },
  });

  const onSubmit = async (data: CreateSubredditPayload) => {
    createCommunity(data);
  };

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto ">
      <div className="relative w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-left font-semibold text-xl">커뮤니티 만들기</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium">이름</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                        r/
                      </p>
                      <Input placeholder="korea" className="pl-6" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription className="text-sm pt-2 space-y-1">
                    <span className="block">
                      대소문자 구별 없이 이름을 작성하세요.
                    </span>
                    <span className="block">
                      이름은 나중에 변경할 수 없습니다.
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant={'subtle'}
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={form.watch('name').trim().length === 0 || isLoading}
              >
                생성
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
