import PostVoteServer from '@/app/api/subreddit/post/vote/PostVoteServer';
import EditorOutput from '@/components/EditorOutput';
import PostVoteShell from '@/components/PostVoteShell';
import { db } from '@/lib/db';
import formatDateString from '@/lib/formatDateString';
import { redis } from '@/lib/redis';
import { CachedPost } from '@/types/redis';
import { Post, User, Vote } from '@prisma/client';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

interface PostDetailProps {
  params: {
    postId: string;
  };
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function PostDetail({
  params: { postId },
}: PostDetailProps) {
  //? 해당 PostID를 가진 게시물이 캐시된 게시물이라면 (추천수가 일정 수 이상)
  //? 캐시된 게시물을 보여주고 아니라면 DB에서 가져온다.

  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatDateString(post?.createdAt ?? cachedPost.createdAt)}
          </p>

          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />
        </div>

        {/* 댓글 */}
      </div>
    </div>
  );
}
