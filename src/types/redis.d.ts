import { VoteType } from '@prisma/client';

type CachedPost = {
  id: string;
  title: string;
  authorUsername: string;
  content: string;
  currentVote: VoteType | null;
  createdAt: Date;
};
