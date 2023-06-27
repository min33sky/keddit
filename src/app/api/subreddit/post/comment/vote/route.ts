import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentVoteValidator } from '@/lib/validators/vote';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        {
          message: 'You must be logged in to vote',
        },
        {
          status: 401,
        },
      );
    }

    // check if user has already voted on this post
    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });

        return NextResponse.json({
          message: 'Vote removed',
        });
      } else {
        // if vote type is different, update the vote
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });

        return NextResponse.json({
          message: 'Vote updated',
        });
      }
    }

    // if no existing vote, create a new vote
    await db.commentVote.create({
      data: {
        type: voteType,
        commentId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Vote created',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      },
    );
  }
}
