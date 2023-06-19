'use client';

import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CreateSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/Button';

export default function CreatePage() {
  const [input, setInput] = useState('');
  const router = useRouter();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post('/api/subreddit', payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          alert('이미 존재하는 커뮤니티입니다.');
        }

        if (err.response?.status === 422) {
          alert('커뮤니티 이름은 3글자 이상 21글자 이하이어야 합니다.');
        }

        if (err.response?.status === 401) {
          alert('로그인이 필요합니다.');
        }
      } else {
        alert('서버 에러');
      }
    },
    onSuccess: (data) => {
      console.log('성공: ', data);

      router.push(`/r/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-left font-semibold">커뮤니티 만들기</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-start pb-2">
            Community names including capitalization cannot be changed.
          </p>

          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Name"
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant={'subtle'} onClick={() => router.back()}>
            취소
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.trim().length === 0}
            onClick={() => createCommunity()}
          >
            만들기
          </Button>
        </div>
      </div>
    </div>
  );
}
