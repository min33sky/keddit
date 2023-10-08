'use client';

import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { PostVoteRequest } from '@/lib/validators/vote';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}

export default function PostVoteClient({
  postId,
  initialVotesAmt,
  initialVote,
}: PostVoteClientProps) {
  const [votesAmt, setVotesAmt] = useState(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch('/api/subreddit/post/vote', payload);
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      //   reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return toast.error('You must be logged in to vote');
        }
      }

      toast.error('Your vote was not registered. Please try again');
    },

    onMutate: (type) => {
      if (currentVote === type) {
        //   User is voting the same way again, so remove their vote
        setCurrentVote(undefined);

        if (type === 'UP') setVotesAmt((prev) => prev - 1);
        else setVotesAmt((prev) => prev + 1);
      } else {
        //   User is voting in the opposite direction, so subtract 2
        setCurrentVote(type);
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-4 pb-4 pr-6 sm:w-20 sm:flex-col sm:gap-0 sm:pb-0">
      <Button
        onClick={() => vote('UP')}
        size={'sm'}
        variant={'ghost'}
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-emerald-500 text-emerald-500': currentVote === 'UP',
          })}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900 dark:text-zinc-300">
        {votesAmt}
      </p>

      <Button
        onClick={() => vote('DOWN')}
        size={'sm'}
        variant={'ghost'}
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-red-500 text-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
}
