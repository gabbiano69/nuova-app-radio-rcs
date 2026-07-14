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

const STREAM_URL = 'https://sr10.inmystream.it/proxy/radiorcs?mp=/stream';
const STATION_NAME = "Radio RCS Sicilia";

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>({ 
    artist: STATION_NAME, 
    title: 'SCEGLI PLAY PER ASCOLTARE', 
    coverUrl: null 
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const metadataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTitleRef = useRef<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (typeof Audio !== 'undefined' && !audioRef.current) {
      const audio = new Audio();
      audio.preload = "none";
      audio.crossOrigin = "anonymous";
      
      audio.addEventListener('play', () => {
        setIsPlaying(true);
        setIsLoading(false);
      });
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('waiting', () => setIsLoading(true));
      audio.addEventListener('playing', () => setIsLoading(false));
      audio.addEventListener('error', () => {
        setIsLoading(false);
        setIsPlaying(false);
      });

      audioRef.current = audio;
    }
    return () => {
      if (metadataIntervalRef.current) clearInterval(metadataIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: nowPlaying.title,
        artist: nowPlaying.artist,
        album: STATION_NAME,
        artwork: nowPlaying.coverUrl ? [
          { src: nowPlaying.coverUrl, sizes: '512x512', type: 'image/png' }
        ] : [] 
      });
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      
      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => togglePlay());
      navigator.mediaSession.setActionHandler('stop', () => stop());
    }
  }, [nowPlaying, isPlaying]);

  const fetchMetadata = async () => {
    const proxyUrl = `https://metadata-rcs-proxy.francescogreco1969.workers.dev/?t=${Date.now()}`;
    
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        const rawText = await response.text();
        
        if (rawText && typeof rawText === 'string') {
          const parts = rawText.split(',');
          if (parts.length >= 7) {
            let fullTitle = parts.slice(6).join(',');
            
            // 1. Decodifica HTML entities e pulizia tag
            fullTitle = fullTitle.replace(/<[^>]*>?/gm, '').trim();
            fullTitle = fullTitle
              .replace(/&APOS;/gi, "'")
              .replace(/&#39;/g, "'")
              .replace(/&QUOT;/gi, '"')
              .replace(/&AMP;/gi, "&")
              .replace(/&EGRAVE;/gi, "è")
              .replace(/&OGRAVE;/gi, "ò")
              .replace(/&AGRAVE;/gi, "à")
              .replace(/&IGRAVE;/gi, "ì")
              .replace(/&UGRAVE;/gi, "ù");
            
            if (fullTitle && fullTitle !== lastTitleRef.current && fullTitle.length > 2) {
              lastTitleRef.current = fullTitle;
              
              const songInfo = fullTitle.split(' - ');
              let finalArtist = STATION_NAME;
              let finalTitle = fullTitle;

              if (songInfo.length >= 2) {
                // CASO 1: Artista - Titolo
                finalArtist = songInfo[0].trim();
                let tempTitle = songInfo.slice(1).join(' - ').trim();

                // --- LOGICA ECCEZIONI (CELENTANO / DEMIS) ---
                const lowerArtist = finalArtist.toLowerCase();
                const lowerTitle = tempTitle.toLowerCase();

                if (lowerTitle.includes(lowerArtist)) {
                  // Troviamo la posizione dell'artista nel titolo
                  const artistPos = lowerTitle.indexOf(lowerArtist);
                  // Rimuoviamo l'artista e tutto ciò che c'è PRIMA (es. "ADRIANO ")
                  tempTitle = tempTitle.substring(artistPos + finalArtist.length).trim();
                }

                // Pulizia simboli rimasti all'inizio
                finalTitle = tempTitle.replace(/^[\s\-\:\–\.\/]+/g, "").trim() || STATION_NAME;
              } else {
                // CASO 2: Solo un testo (Programma o Playlist)
                finalArtist = fullTitle.trim();
                finalTitle = STATION_NAME;
              }
              
              // Applichiamo il maiuscolo per estetica radiofonica
              setNowPlaying(prev => ({ 
                ...prev, 
                artist: finalArtist.toUpperCase(), 
                title: finalTitle.toUpperCase() 
              }));
              
              const query = finalArtist !== STATION_NAME ? `${finalArtist} ${finalTitle}` : finalTitle;
              fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=1&media=music`)
                .then(res => res.json())
                .then(itunesData => {
                  if (itunesData.results?.[0]) {
                    const cover = itunesData.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
                    setNowPlaying(prev => ({ ...prev, coverUrl: cover }));
                  } else {
                    setNowPlaying(prev => ({ ...prev, coverUrl: null }));
                  }
                }).catch(() => {
                  setNowPlaying(prev => ({ ...prev, coverUrl: null }));
                });
            }
          }
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isPlaying) {
      fetchMetadata();
      metadataIntervalRef.current = setInterval(fetchMetadata, 10000);
    } else {
      if (metadataIntervalRef.current) clearInterval(metadataIntervalRef.current);
    }
    return () => {
      if (metadataIntervalRef.current) clearInterval(metadataIntervalRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      setIsPlaying(false);
      setNowPlaying({ artist: STATION_NAME, title: 'SCEGLI PLAY PER ASCOLTARE', coverUrl: null });
      lastTitleRef.current = "";
    } else {
      setIsLoading(true);
      setNowPlaying({ artist: STATION_NAME, title: 'LIVE STREAMING...', coverUrl: null });
      
      const freshUrl = `${STREAM_URL}${STREAM_URL.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      audioRef.current.src = freshUrl;
      audioRef.current.play()
        .then(() => {
          fetchMetadata();
        })
        .catch(() => {
          setIsLoading(false);
          toast({ title: "Errore", description: "Impossibile collegarsi allo streaming.", variant: "destructive" });
        });
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      setIsPlaying(false);
      setNowPlaying({ artist: STATION_NAME, title: 'SCEGLI PLAY PER ASCOLTARE', coverUrl: null });
      lastTitleRef.current = "";
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
