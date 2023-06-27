'use client';

import type { Comment, CommentVote, User } from '@prisma/client';
import React, { useRef } from 'react';
import UserAvatar from './UserAvatar';
import formatDateString from '@/lib/formatDateString';
import CommentVoteComponent from './CommentVote';

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

      <div className="flex gap-2 items-center">
        <CommentVoteComponent
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />
      </div>
    </div>
  );
}
