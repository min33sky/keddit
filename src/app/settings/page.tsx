import UserNameForm from '@/components/username-form';
import { authOptions, getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
  title: '설정 페이지',
  description: 'Manage account and website settings.',
};

export default async function SettingsPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || '/sign-in');
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">설정</h1>

        <div className="grid gap-10">
          <UserNameForm
            user={{
              id: session.user.id,
              username: session.user.username || '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
