import CustomFeed from '@/components/feeds/CustomFeed';
import GeneralFeed from '@/components/feeds/GeneralFeed';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import { HomeIcon, NewspaperIcon } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Home() {
  const session = await getAuthSession();

  console.log('### session : ', session);

  return (
    <>
      <h1 className="flex items-center font-bold text-2xl md:text-xl">
        <NewspaperIcon className="w-5 h-5 mr-2" />
        {session?.user ? session.user.username : ''} Feeds
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {session ? <CustomFeed /> : <GeneralFeed />}

        {/* Subreddit info */}
        <div
          className="md:sticky md:top-14 overflow-hidden h-fit rounded-lg border border-gray-200
          order-first md:order-last dark:border-slate-700"
        >
          <div className="bg-emerald-100 dark:bg-slate-800 px-6 py-3">
            <p className="font-semibold py-2 flex items-center gap-1.5">
              <HomeIcon className="h-4 w-4" />홈
            </p>
          </div>

          <div className="-my-3 px-6 py-4 text-sm leading-6 dark:bg-zinc-900">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-600 dark:text-slate-400">
                당신이 좋아하는 주제로 커뮤니티를 만들어보세요.
              </p>
            </div>

            <Link
              href="/r/create"
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
            >
              커뮤니티 만들기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
