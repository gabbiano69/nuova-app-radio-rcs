"use client"

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NowPlaying {
  artist: string;
  title: string;
  coverUrl?: string | null;
}

interface AudioContextType {
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  nowPlaying: NowPlaying;
  togglePlay: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
  setIsMuted: (m: boolean) => void;
  fetchMetadata: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const DEFAULT_STREAM = 'https://sr10.inmystream.it/proxy/radiorcs?mp=/stream';
const STATION_NAME = process.env.NEXT_PUBLIC_STATION_NAME || "Radio RCS Sicilia";
const STATION_SLOGAN = process.env.NEXT_PUBLIC_STATION_SLOGAN || "I Grandi Successi";

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({ 
    artist: '', 
    title: 'Pronto all\'ascolto...', 
    coverUrl: null 
  });
  const [mounted, setMounted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTitleRef = useRef<string>("");
  const { toast } = useToast();
  
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const DEFAULT_LOGO = '/logo-rcs.png';

  const getAbsoluteUrl = (path: string) => {
    if (typeof window === 'undefined') return path;
    if (path.startsWith('http')) return path;
    const origin = window.location.origin;
    const fullPath = `${basePath}${path.startsWith('/') ? '' : '/'}${path}`;
    return `${origin}${fullPath}`;
  };

  useEffect(() => {
    setMounted(true);
    if (!audioRef.current && typeof Audio !== 'undefined') {
      const audio = new Audio();
      audio.preload = "none";
      audio.crossOrigin = "anonymous";
      audioRef.current = audio;
    }
  }, []);

  // --- MODIFICA INTEGRATA: MEDIA SESSION ROBUSTA ---
  useEffect(() => {
    if (mounted && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: nowPlaying.title,
        artist: nowPlaying.artist || STATION_NAME,
        album: STATION_NAME,
        artwork: [
          { src: getAbsoluteUrl(nowPlaying.coverUrl || DEFAULT_LOGO), sizes: '512x512', type: 'image/png' }
        ]
      });

      // Notifica ad Android lo stato esatto (indispensabile per la tendina)
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      try {
        navigator.mediaSession.setActionHandler('play', () => togglePlay());
        navigator.mediaSession.setActionHandler('pause', () => togglePlay());
        navigator.mediaSession.setActionHandler('stop', () => stop());
      } catch (error) {
        console.warn("MediaSession error", error);
      }
    }
  }, [nowPlaying, isPlaying, mounted]);

  const cleanMetadata = (text: string) => {
    if (!text) return "";
    let cleaned = text.trim();
    cleaned = cleaned
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'");

    const lowercaseCleaned = cleaned.toLowerCase();
    const isGeneric = (lowercaseCleaned.includes("radio") && cleaned.length < 30) || cleaned.length < 3;
    if (isGeneric) return `${STATION_NAME} - ${STATION_SLOGAN}`;
    return cleaned;
  };

  const fetchMetadata = async () => {
    try {
      const timestamp = new Date().getTime();
      const metadataUrl = `https://sr10.inmystream.it/proxy/radiorcs?mp=/7.html&_=${timestamp}`;
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(metadataUrl)}`);
      const rawContent = await response.text();
      
      if (rawContent) {
        const parts = rawContent.split(',');
        if (parts.length >= 7) {
          const rawTitle = parts.slice(6).join(',');
          const fullTitle = cleanMetadata(rawTitle);
          if (fullTitle && fullTitle !== lastTitleRef.current) {
            lastTitleRef.current = fullTitle;
            const songInfo = fullTitle.split(' - ');
            const isGeneric = fullTitle.includes(STATION_NAME);
            const artist = songInfo.length >= 2 ? songInfo[0].trim() : (isGeneric ? "" : STATION_NAME);
            const title = songInfo.length >= 2 ? songInfo[1].trim() : (isGeneric ? STATION_SLOGAN : songInfo[0].trim());
            setNowPlaying({ artist, title, coverUrl: null });
            
            if (!isGeneric && title !== STATION_SLOGAN) {
              const searchTerm = encodeURIComponent(`${artist} ${title}`);
              fetch(`https://itunes.apple.com/search?term=${searchTerm}&limit=1&media=music`)
                .then(res => res.json())
                .then(itunesData => {
                  if (itunesData.results && itunesData.results.length > 0) {
                    const betterCover = itunesData.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
                    setNowPlaying(prev => ({ ...prev, coverUrl: betterCover }));
                  }
                })
                .catch(() => {});
            }
          }
        }
      }
    } catch (error) {
      console.warn("Metadata error:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && mounted) {
      fetchMetadata();
      interval = setInterval(fetchMetadata, 15000); 
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, mounted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    const streamUrl = process.env.NEXT_PUBLIC_STREAM_URL || DEFAULT_STREAM;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = ""; 
      audioRef.current.load();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      // Aggancio timestamp per evitare cache
      audioRef.current.src = `${streamUrl}${streamUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      audioRef.current.play()
        .then(() => { 
          setIsPlaying(true); 
          setIsLoading(false); 
        })
        .catch((err) => {
          console.error("Playback error:", err);
          setIsLoading(false);
          toast({ title: "Errore Streaming", description: "Impossibile collegarsi.", variant: "destructive" });
        });
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      setIsPlaying(false);
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none';
      }
    }
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, isLoading, volume, isMuted, nowPlaying, togglePlay, stop, setVolume, setIsMuted, fetchMetadata
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) throw new Error('useAudio must be used within an AudioProvider');
  return context;
}