
'use client';

import { useState, useEffect } from 'react';
import { AudioPlayer } from '@/components/AudioPlayer';
import SitoWebLandingPage from './sito-web/page';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const isApp = process.env.NEXT_PUBLIC_IS_APP === 'true';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isApp) {
    return (
      <main className="h-[calc(100vh-64px)] bg-background flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-md h-full p-4 animate-in fade-in duration-700">
          <AudioPlayer />
        </div>
      </main>
    );
  }

  return <SitoWebLandingPage />;
}
