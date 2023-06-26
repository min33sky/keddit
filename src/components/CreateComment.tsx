'use client';

import React, { startTransition, useState } from 'react';
import { Label } from './ui/Label';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { CommentRequest } from '@/lib/validators/comment';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Props {
  postId: string;
  replyToId?: string;
}

export default function CreatetComment({ postId, replyToId }: Props) {
  const [comment, setComment] = useState('');
  const router = useRouter();

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload,
      );
      return data;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error('로그인이 필요합니다.');
        }
      }

      toast.error('댓글을 작성하는데 실패했습니다.');
    },

    onSuccess: () => {
      toast.success('댓글을 성공적으로 작성했습니다.');
      startTransition(() => router.refresh());

      setComment('');
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Comment</Label>

      <div className="mt-2">
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />

        <div className="mt-2 flex justify-end">
          <Button
            disabled={comment.trim() === ''}
            isLoading={isLoading}
            onClick={() =>
              createComment({
                text: comment,
                postId,
                replyToId,
              })
            }
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );
}
