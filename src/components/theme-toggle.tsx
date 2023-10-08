'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './Icons';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? (
          <SunIcon />
        ) : (
          <MoonIcon className="text-yellow-600" />
        )}
      </button>
    </>
  );
}
