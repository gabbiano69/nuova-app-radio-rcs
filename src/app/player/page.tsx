
'use client';

import { useState, useEffect } from 'react';
import { AudioPlayer } from '@/components/AudioPlayer';

export default function PlayerPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="h-[calc(100vh-64px)] bg-background flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-md h-full p-6 animate-in fade-in duration-700">
        <AudioPlayer />
      </div>
    </main>
  );
}
