"use client"

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Play, Pause, Square, Music, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';
import { cn } from '@/lib/utils';

export function MiniPlayer() {
  const pathname = usePathname();
  const { isPlaying, nowPlaying, togglePlay, stop, isLoading } = useAudio();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Non mostriamo il miniplayer se non siamo montati o se siamo nella home
  // (dove c'è già il player principale in modalità App o Sito)
  if (!mounted || pathname === '/' || (!isPlaying && !isLoading)) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-500 sm:bottom-4 sm:left-4 sm:right-4 sm:max-w-md sm:mx-auto">
      <div className="glass-morphism border-t border-white/10 p-3 sm:rounded-2xl sm:border flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
            {isPlaying ? (
              <Activity className="animate-pulse" size={20} />
            ) : (
              <Music size={20} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-primary font-black text-[10px] uppercase tracking-widest leading-none mb-1">
              Live Streaming
            </p>
            <p className="text-white font-bold text-sm truncate leading-tight">
              {nowPlaying.title || 'In ascolto...'}
            </p>
            <p className="text-muted-foreground text-[11px] font-medium truncate">
              {nowPlaying.artist || 'Radio RCS Sicilia'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="w-9 h-9 rounded-full text-muted-foreground/40 hover:text-destructive transition-colors"
            onClick={stop}
          >
            <Square size={14} fill="currentColor" />
          </Button>
          <Button
            size="icon"
            className={cn(
              "w-11 h-11 rounded-full shadow-lg transition-transform active:scale-90",
              isPlaying ? "bg-white text-black hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"
            )}
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} className="ml-1" fill="currentColor" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
