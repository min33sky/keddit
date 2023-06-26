import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validators/comment';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        {
          message: 'You must be logged in to do that',
        },
        { status: 401 },
      );
    }

    await db.comment.create({
      data: {
        text,
        postId,
        replyToId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: 'Comment created',
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      { status: 500 },
    );
  }
}
