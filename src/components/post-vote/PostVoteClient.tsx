import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <div className="flex gap-4 pb-4 pr-6 sm:w-20 sm:flex-col sm:gap-0 sm:pb-0">
      <Button size={'sm'} variant={'ghost'} aria-label="upvote">
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-emerald-500 text-emerald-500': currentVote === 'UP',
          })}
        />
      </Button>

      <p className="py-2 text-center text-sm font-medium text-zinc-900">
        {votesAmt}
      </p>

      <Button size={'sm'} variant={'ghost'} aria-label="downvote">
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-red-500 text-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
}
