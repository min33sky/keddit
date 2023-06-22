import { Post, User, Vote } from '@prisma/client';
import React from 'react';

type PartialVote = Pick<Vote, 'type'>;

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmt: number;
  subredditName: string;
  currentVote?: PartialVote;
  commentAmt: number;
}

export default function Post({
  post,
  votesAmt,
  subredditName,
  currentVote,
  commentAmt,
}: PostProps) {
  return <div>Post</div>;
}
