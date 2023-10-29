'use client';

import type { Comment, CommentVote, User } from '@prisma/client';
import React, { startTransition, useRef, useState } from 'react';
import UserAvatar from './UserAvatar';
import formatDateString from '@/lib/formatDateString';
import CommentVoteComponent from './CommentVote';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Label } from './ui/Label';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { useMutation } from '@tanstack/react-query';
import { CommentRequest } from '@/lib/validators/comment';
import axios from 'axios';
import { toast } from 'sonner';
import { Textarea } from './ui/Textarea';

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

export default function PostComment({
  comment,
  votesAmt,
  currentVote,
  postId,
}: PostCommentProps) {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState<string>(`@${comment.author.username} `);
  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });

  const { mutate: postComment, isLoading } = useMutation({
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

    onError: (error) => {
      toast.error('Something went wrong, please try again later');
    },

    onSuccess: () => {
      startTransition(() => {
        toast.success('Comment posted');
        setIsReplying(false);
        setInput('');
        router.refresh();
      });
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name,
            image: comment.author.image,
          }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.name}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatDateString(comment.createdAt)}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVoteComponent
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) {
              return router.push('/sign-in');
            }
            setIsReplying((prev) => !prev);
          }}
          variant={'ghost'}
          size={'xs'}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          답글
        </Button>

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">댓글 달기</Label>
            <div className="mt-2">
              <Textarea
                onFocus={(e) =>
                  e.currentTarget.setSelectionRange(
                    e.currentTarget.value.length,
                    e.currentTarget.value.length,
                  )
                }
                autoFocus
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                >
                  취소
                </Button>
                <Button
                  isLoading={isLoading}
                  onClick={() => {
                    if (!input) return;
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id, // default to top-level comment
                    });
                  }}
                >
                  등록
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
