'use client';

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config';
import type { ExtendedPost } from '@/types/db';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useRef } from 'react';
import Post from './Post';
import { Loader2 } from 'lucide-react';
import useIntersection from '@/hooks/useIntersection';

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

export default function PostFeed({
  initialPosts,
  subredditName,
}: PostFeedProps) {
  const lastPostRef = useRef<HTMLLIElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['infinite-query'],
      queryFn: async ({ pageParam = 1 }) => {
        const query =
          `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
          `${!!subredditName ? `&subredditName=${subredditName}` : ''}`;

        const { data } = await axios.get<ExtendedPost[]>(query);
        return data;
      },
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    });

  useEffect(() => {
    if (entry?.isIntersecting) {
      if (hasNextPage) {
        fetchNextPage(); // Load more posts when the last post comes into view
      }
    }
  }, [entry?.isIntersecting, fetchNextPage, hasNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 flex flex-col space-y-6">
      {posts?.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1;
          if (vote.type === 'DOWN') return acc - 1;
          return acc;
        }, 0);

        const currentVote = post?.votes.find(
          (vote) => vote.userId === session?.user.id,
        );

        if (index === posts.length - 1) {
          //? Add a ref to the last post in the list
          return (
            <li key={post.id} ref={ref}>
              <Post
                subredditName={post.subreddit.name}
                post={post}
                commentAmt={post.comments.length}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              subredditName={post.subreddit.name}
              post={post}
              commentAmt={post.comments.length}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          );
        }
      })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </li>
      )}
    </ul>
  );
}
