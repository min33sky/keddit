import { z } from 'zod';

export const SubredditValidator = z.object({
  name: z
    .string()
    .min(3, {
      message: '이름은 최소 3자리 이상 입력해주세요.',
    })
    .max(21, {
      message: '이름은 최대 21자리까지 가능합니다.',
    }),
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
