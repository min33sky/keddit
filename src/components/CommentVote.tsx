import usePrevious from '@/hooks/usePrevious';
import type { CommentVote } from '@prisma/client';
import React, { useState } from 'react';

type PartialVote = Pick<CommentVote, 'type'>;

interface CommentVoteProps {
  commentId: string;
  votesAmt: number;
  currentVote?: PartialVote;
}

export default function CommentVote({
  commentId,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
}: CommentVoteProps) {
  const [votesAmt, setVotesAmt] = useState(_votesAmt);
  const [currentVote, setCurrentVote] = useState(_currentVote);

  const prevVote = usePrevious(currentVote);

  return <div>CommentVotes</div>;
}
