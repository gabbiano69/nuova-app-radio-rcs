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
const STATION_NAME = "RADIO RCS SICILIA";

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

  // Funzione per richiedere permessi notifica (Vitale per Android 13+)
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch (e) {
          console.error("Errore richiesta permessi", e);
        }
      }
    }
  };

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
        // Se c'è un errore (es. standby prolungato), resettiamo il sorgente
        if (audioRef.current) audioRef.current.src = "";
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
            
            // 1. Decodifica HTML e caratteri speciali
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
              
              // Supporto a diversi tipi di trattini
              const songInfo = fullTitle.split(/\s+[\-\–\—]\s+/);
              
              let finalArtist = STATION_NAME;
              let finalTitle = fullTitle;

              if (songInfo.length >= 2) {
                let partA = songInfo[0].trim();
                let partB = songInfo.slice(1).join(' - ').trim();

                const lowerA = partA.toLowerCase();
                const lowerB = partB.toLowerCase();

                // --- LOGICA DI PULIZIA AVANZATA (Rilevamento Inversione) ---
                // Caso Modugno: A="Domenico Modugno Amara terra mia" B="Modugno"
                if (lowerA.includes(lowerB)) {
                  finalArtist = partB;
                  const pos = lowerA.indexOf(lowerB);
                  // Taglia via il nome dell'artista e tutto quello che c'è prima nel titolo
                  finalTitle = partA.substring(pos + lowerB.length).trim();
                } 
                // Caso Invertito: A="Modugno" B="Domenico Modugno Amara terra mia"
                else if (lowerB.includes(lowerA)) {
                  finalArtist = partA;
                  const pos = lowerB.indexOf(lowerA);
                  finalTitle = partB.substring(pos + lowerA.length).trim();
                } 
                else {
                  // Caso standard: A="Artista" B="Titolo"
                  finalArtist = partA;
                  finalTitle = partB;
                }

                // Pulizia simboli rimasti all'inizio del titolo
                finalTitle = finalTitle.replace(/^[\s\-\:\–\.\/]+/g, "").trim() || STATION_NAME;
              } else {
                // Caso senza trattino: tutto su riga 1
                finalArtist = fullTitle.trim();
                finalTitle = STATION_NAME;
              }
              
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

  const togglePlay = async () => {
    if (!audioRef.current) return;

    // Chiediamo il permesso per le notifiche prima di partire
    await requestNotificationPermission();
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = ""; // Fondamentale per resettare lo stream
      audioRef.current.load();
      setIsPlaying(false);
      setNowPlaying({ artist: STATION_NAME, title: 'SCEGLI PLAY PER ASCOLTARE', coverUrl: null });
      lastTitleRef.current = "";
    } else {
      setIsLoading(true);
      setNowPlaying({ artist: STATION_NAME, title: 'LIVE STREAMING...', coverUrl: null });
      
      // Reset preventivo per sbloccare i comandi
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();

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
