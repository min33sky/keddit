import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubredditValidator } from '@/lib/validators/subreddit';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a subreddit' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { name } = SubredditValidator.parse(body);

    // 서브레딧이 이미 존재하는지 확인
    const subredditExists = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExists) {
      return NextResponse.json(
        {
          error: 'A subreddit with that name already exists',
        },
        {
          status: 409,
        },
      );
    }

    // 서브레딧 생성
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // 서브레딧 생성자를 구독자로 추가
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });

    return NextResponse.json(subreddit.name, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 422,
        },
      );
    }
  }
}
