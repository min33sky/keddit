'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

export default function ModalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleClose = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    },
    [router],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleClose);

    return () => {
      window.removeEventListener('keydown', handleClose);
    };
  }, [handleClose]);

  return (
    <div className="fixed inset-0 bg-zinc-900/50 z-10 backdrop-blur-sm ">
      <div onClick={() => router.back()} className="fixed inset-0" />
      {children}
    </div>
  );
}
