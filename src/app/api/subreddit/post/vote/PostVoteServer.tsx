import PostVoteClient from '@/components/post-vote/PostVoteClient';
import { getAuthSession } from '@/lib/auth';
import { Post, Vote, VoteType } from '@prisma/client';
import { notFound } from 'next/navigation';
import React from 'react';

interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

export default async function PostVoteServer({
  postId,
  initialVotesAmt,
  initialVote,
  getData,
}: PostVoteServerProps) {
  const session = await getAuthSession();

  let _voteAmt: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();
    if (!post) return notFound();

    _voteAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === 'UP') return acc + 1;
      else if (vote.type === 'DOWN') return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id,
    )?.type;
  } else {
    _voteAmt = initialVotesAmt ?? 0;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVotesAmt={_voteAmt}
      initialVote={_currentVote}
    />
  );
}
