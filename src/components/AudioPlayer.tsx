"use client"

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Share2, Activity, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAudio } from '@/context/AudioContext';
import { useToast } from '@/hooks/use-toast';

export function AudioPlayer() {
  const { 
    isPlaying, 
    isLoading, 
    volume, 
    isMuted, 
    nowPlaying, 
    togglePlay, 
    stop, 
    setVolume, 
    setIsMuted 
  } = useAudio();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const { artist, title } = nowPlaying;
  
    // TESTO DI CONDIVISIONE DINAMICO
    const isPlayingNow = artist !== "RADIO RCS SICILIA" && title !== "SCEGLI PLAY PER ASCOLTARE";
    const songInfo = isPlayingNow ? `${artist} - ${title}` : "I Grandi Successi";
  
    const shareText = `Sto ascoltando ${songInfo} su Radio RCS Sicilia! 📻\nVieni ad ascoltarla anche Tu!`;
    const websiteUrl = 'https://www.rcsradio.it';
  
    try {
      const { Share } = await import('@capacitor/share');
      const canShare = await Share.canShare();
  
      if (canShare.value) {
        await Share.share({
          title: 'Radio RCS Sicilia',
          text: shareText,
          url: websiteUrl,
          dialogTitle: 'Condividi con i tuoi amici',
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${websiteUrl}`);
        toast({ title: "Link Copiato!", description: "Incolla dove preferisci per condividere." });
      }
    } catch (e) {
      await navigator.clipboard.writeText(`${shareText} ${websiteUrl}`);
      toast({ title: "Link Copiato!" });
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between select-none py-4 px-2 overflow-hidden">
      {/* Top Section: Logo & Status */}
      <div className="w-full flex flex-col items-center gap-2 shrink-0">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/10 bg-white p-1 shadow-xl">
          <Image 
            src={`${basePath}/logo-rcs.png`}
            alt="Logo" 
            fill 
            className="object-contain rounded-full"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[7px] sm:text-[8px] font-black text-white/40 tracking-[0.3em] uppercase">
            #laradiooltreconfine
          </p>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn(
                "px-1.5 py-0 text-[7px] sm:text-[8px] font-black border-primary text-primary bg-primary/5",
                isPlaying && "animate-pulse"
              )}
            >
              ON AIR
            </Badge>
            <button 
              onClick={handleShare} 
              className="text-white/30 hover:text-white transition-colors"
              title="Condividi"
            >
              <Share2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section: Cover & Text Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-3 min-h-0 overflow-hidden">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-zinc-900/50 shrink-0">
          {nowPlaying.coverUrl ? (
            <Image 
              src={nowPlaying.coverUrl} 
              alt="Cover"
              fill
              className={cn("object-cover transition-all duration-1000", isPlaying ? "scale-105" : "scale-100 opacity-50 grayscale-[50%]")}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-full bg-white/5">
                <Music className="text-white/20" size={28} />
              </div>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Live Stream</p>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Info Text: INVERTITI RIGA 1 E RIGA 2 */}
        <div className="text-center w-full max-w-[300px] px-2 flex flex-col justify-center min-h-[60px] overflow-hidden">
          {/* RIGA 1: ARTISTA (GRANDE E IN BIANCO) */}
          <h2 className="text-[12px] sm:text-[14px] font-black text-white italic tracking-tighter uppercase leading-tight line-clamp-2">
            {nowPlaying.artist || 'RADIO RCS SICILIA'}
          </h2>
          {/* RIGA 2: TITOLO (SOTTO E IN COLORE PRIMARY) */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <Music size={16} className="text-primary/80 shrink-0" />
            <p className="text-primary font-black text-[12px] sm:text-[14px] uppercase tracking-[0.05em] truncate">
              {nowPlaying.title || 'I GRANDI SUCCESSI'}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Compact Controls */}
      <div className="w-full space-y-4 shrink-0 pt-2 pb-2">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={stop} 
            className="text-white/20 hover:text-destructive transition-colors active:scale-90"
            title="Stop"
          >
            <Square size={14} fill="currentColor" />
          </button>
          
          <Button
            size="icon"
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all active:scale-95 border-2 border-transparent",
              isPlaying 
                ? "bg-white text-black hover:bg-white border-white/20" 
                : "bg-primary text-white hover:bg-primary shadow-primary/20"
            )}
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isPlaying ? (
              <Pause size={22} fill="currentColor" />
            ) : (
              <Play size={22} className="ml-1" fill="currentColor" />
            )}
          </Button>

          <div className="w-5 h-5 flex items-center justify-center">
            {isPlaying && <Activity size={14} className="text-primary animate-pulse" />}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/5 max-w-[200px] mx-auto">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-white/40 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={(vals) => { setVolume(vals[0]); setIsMuted(false); }}
            className="flex-1 cursor-pointer h-1.5"
          />
        </div>
      </div>
    </div>
  );
}
