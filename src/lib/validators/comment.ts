import { z } from 'zod';

export const CommentValidator = z.object({
  text: z.string(),
  postId: z.string(), // 게시글 id
  replyToId: z.string().optional(), // 댓글 id
});

export type CommentRequest = z.infer<typeof CommentValidator>;
