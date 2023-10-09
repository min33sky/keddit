'use client';

import type { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import UserAvatar from './UserAvatar';
import { Button } from './ui/Button';
import { Image as ImageIcon, Link2 } from 'lucide-react';
import { Input } from './ui/input';

interface Props {
  session: Session | null;
}

export default function MiniCreatePost({ session }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className="overflow-hidden rounded-md shadow list-none border bg-white border-slate-100 dark:border-zinc-600 dark:bg-zinc-900">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user?.name,
              image: session?.user?.image,
            }}
          />

          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
        </div>

        <Input
          onClick={() => router.push(pathname + '/submit')}
          readOnly
          placeholder="Create Post"
        />
        <Button
          variant={'ghost'}
          onClick={() => router.push(pathname + '/submit')}
        >
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button
          variant={'ghost'}
          onClick={() => router.push(pathname + '/submit')}
        >
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
}
