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
            fullTitle = fullTitle.replace(/<[^>]*>?/gm, '').trim();
            
            if (fullTitle && fullTitle !== lastTitleRef.current && fullTitle.length > 2) {
              lastTitleRef.current = fullTitle;
              
              // Dividiamo la stringa usando il separatore " - "
              const songInfo = fullTitle.split(' - ');
              
              let finalArtist = STATION_NAME;
              let finalTitle = fullTitle;

              if (songInfo.length >= 2) {
                // RIGA 1: Prendiamo la prima parte come Artista
                finalArtist = songInfo[0].trim();
                
                // RIGA 2: Prendiamo il resto come Titolo
                let tempTitle = songInfo.slice(1).join(' - ').trim();

                // --- PULIZIA DUPLICATO ---
                // Se il titolo inizia con lo stesso nome dell'artista (es. "NOEMI - NOEMI VUOTO A PERDERE")
                if (tempTitle.toLowerCase().startsWith(finalArtist.toLowerCase())) {
                  // Rimuoviamo l'artista dall'inizio del titolo
                  const cleanedTitle = tempTitle.substring(finalArtist.length).trim();
                  
                  // Se dopo la pulizia il titolo non è vuoto, lo usiamo, altrimenti teniamo quello originale
                  if (cleanedTitle.length > 0) {
                    // Puliamo eventuali trattini o punti rimasti all'inizio (es. "- Vuoto a perdere" -> "Vuoto a perdere")
                    finalTitle = cleanedTitle.replace(/^[\s\-\:\–\.]+/g, "").trim();
                  } else {
                    finalTitle = tempTitle;
                  }
                } else {
                  finalTitle = tempTitle;
                }
              }
              
              // Aggiorniamo lo stato: Artist andrà in Riga 1, Title in Riga 2
              setNowPlaying(prev => ({ ...prev, artist: finalArtist, title: finalTitle }));
              
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
      // Durante il caricamento, mostriamo il nome della radio e lo stato
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
