'use client';

import { Post, User, Vote } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import React, { useRef } from 'react';
import EditorOutput from './EditorOutput';
import PostVoteClient from './post-vote/PostVoteClient';
import formatDateString from '@/lib/formatDateString';
import Link from 'next/link';

type PartialVote = Pick<Vote, 'type'>;

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  subredditName: string;
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
}

export default function Post({
  post,
  subredditName,
  commentAmt,
  votesAmt,
  currentVote,
}: PostProps) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="rounded-md bg-white dark:bg-zinc-900 shadow">
      <div className="flex justify-between px-6 py-4">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  className="text-sm underline underline-offset-2"
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>

                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name}</span>{' '}
            {formatDateString(post.createdAt)}
          </div>

          <Link href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6">
              {post.title}
            </h1>
          </Link>

          <div
            ref={paragraphRef}
            className="relative max-h-40 w-full overflow-clip text-sm"
          >
            <EditorOutput content={post.content} />

            {
              //? 그라데이션 처리
              paragraphRef.current?.clientHeight === 160 ? (
                <div
                  className={`absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent dark:from-zinc-900`}
                />
              ) : null
            }
          </div>
        </div>
      </div>

      <div className="z-20 bg-gray-50 dark:bg-zinc-800 p-4 text-sm sm:px-6">
        <a
          href={`/r/${subredditName}/post/${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmt || 0}개의 댓글
        </a>
      </div>
    </div>
  );
}
