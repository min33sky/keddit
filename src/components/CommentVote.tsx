import usePrevious from '@/hooks/usePrevious';
import { cn } from '@/lib/utils';
import type { CommentVote, VoteType } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { CommentVoteRequest } from '@/lib/validators/vote';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

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

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId,
      };

      await axios.patch(`/api/subreddit/post/comment/vote`, payload);
    },

    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error('You must be logged in to vote');
        }
      }

      toast.error('댓글 투표에 실패했습니다.');
    },

    onMutate: (type) => {
      if (currentVote?.type === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined);
        if (type === 'UP') setVotesAmt((prev) => prev - 1);
        else setVotesAmt((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subract 2
        setCurrentVote({ type });
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN')
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size="xs"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p className="text-center py-2 px-1 font-medium text-xs text-zinc-900">
        {votesAmt}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size="xs"
        className={cn({
          'text-emerald-500': currentVote?.type === 'DOWN',
        })}
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
}
