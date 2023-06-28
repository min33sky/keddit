import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { UsernameValidator } from '@/lib/validators/username';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          message: 'Not authenticated',
        },
        {
          status: 401,
        },
      );
    }

    const body = await req.json();
    const { name } = UsernameValidator.parse(body);

    // check if username is taken
    const username = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return NextResponse.json(
        {
          message: 'Username is taken',
        },
        {
          status: 400,
        },
      );
    }

    // update username

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return NextResponse.json(
      {
        message: 'Username updated',
      },
      {
        status: 200,
      },
    );
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
