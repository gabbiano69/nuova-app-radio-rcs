
"use client"

import { AudioPlayer } from '@/components/AudioPlayer';
import { InteractiveSection } from '@/components/InteractiveSection';
import { SocialGallery } from '@/components/SocialGallery';
import { Radio, Music, Headphones, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useAudio } from '@/context/AudioContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function SitoWebLandingPage() {
  const { isPlaying, togglePlay, isLoading } = useAudio();
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [mounted, setMounted] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900">
      {/* Header pulito - Logo e Scritta Ingranditi */}
      <div className="w-full bg-white border-b border-slate-100 py-6 px-6 sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
            <Image 
              src={`${basePath}/logo-rcs.png`}
              alt="Logo Radio RCS" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase text-slate-950 leading-none">
            Radio RCS <span className="text-primary">Sicilia</span>
          </h2>
        </div>
      </div>

      <section className="relative flex flex-col items-center py-4 lg:py-8 px-6 overflow-hidden">
        {/* Decorazioni di background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 animate-float"><Radio size={120} /></div>
          <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}><Music size={100} /></div>
        </div>

        <div className="max-w-7xl mx-auto w-full z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center w-full">
            
            {/* Sezione Testo: In alto su mobile */}
            <div className="space-y-3 sm:space-y-4 text-center lg:text-left order-1 lg:order-1 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black tracking-widest uppercase mx-auto lg:mx-0">
                <Headphones size={12} /> La Radio del Cuore della Sicilia
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
                I Grandi <br />
                <span className="text-primary italic">Successi.</span>
              </h1>
              
              <p className="text-xs sm:text-base text-slate-500 max-w-md leading-relaxed font-medium mx-auto lg:mx-0">
                Ascolta Radio RCS Sicilia ovunque tu sia. La musica più bella e l'interazione diretta con la tua radio preferita.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                <Button 
                  size="lg" 
                  onClick={togglePlay}
                  disabled={isLoading}
                  className={cn(
                    "rounded-full h-10 sm:h-12 px-6 text-sm sm:text-base font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2",
                    isPlaying ? "bg-white text-black border border-slate-200" : "bg-primary text-white"
                  )}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <><Pause size={16} className="fill-current" /> Sospendi</>
                  ) : (
                    <><Play size={16} className="fill-current" /> Ascolta</>
                  )}
                </Button>

                <a href="https://play.google.com/store/apps/details?id=it.rcsradio.sicilia" target="_blank" rel="noopener noreferrer">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="h-10 sm:h-12 px-5 rounded-full bg-black border-none text-white flex items-center gap-2 hover:bg-slate-900 shadow-lg"
                  >
                    <div className="w-4 h-4">
                      <svg viewBox="0 0 512 512" className="w-full h-full fill-white">
                        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.1 18-26.7-1.2-36.3zM104.6 499l220.7-127.3-60.7-60.7L104.6 499z"/>
                      </svg>
                    </div>
                    <div className="flex flex-col items-start leading-none text-left">
                      <span className="text-[6px] font-bold uppercase opacity-70">App Android</span>
                      <span className="text-xs font-bold">Google Play</span>
                    </div>
                  </Button>
                </a>
              </div>
            </div>

            {/* Mockup Smartphone: Leggermente rimpicciolito */}
            <div className="relative flex justify-center lg:justify-end order-2 lg:order-2 pb-6">
              <div className="relative w-full max-w-[300px] sm:max-w-[360px] aspect-[9/18.5] rounded-[3.2rem] bg-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] p-4 border-[12px] border-slate-900 flex flex-col overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] player-gradient pointer-events-none opacity-40" />
                <div className="z-10 w-full h-full flex flex-col no-scrollbar">
                  <AudioPlayer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InteractiveSection />
      <SocialGallery />

      <footer className="py-8 px-6 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 text-center md:text-left">
          <div className="space-y-3">
            <h2 className="text-xl font-black italic uppercase text-primary">Radio RCS Sicilia</h2>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              La radio che accorcia le distanze. Dal cuore della Sicilia portiamo la nostra passione in tutto il mondo.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-white/50">Info Legali</h4>
            <ul className="space-y-1.5 text-[10px]">
              <li><Link href="/about/" className="hover:text-primary transition-colors">Chi Siamo</Link></li>
              <li><Link href="/contact/" className="hover:text-primary transition-colors">Contatti</Link></li>
              <li><Link href="/privacy/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-white/50">Contatti</h4>
            <p className="text-slate-400 text-[10px]">Serradifalco (CL)</p>
            <p className="text-primary font-bold text-[10px]">radiorcs@hotmail.it</p>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-4 border-t border-white/5 text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">
          <p>&copy; {currentYear} Radio RCS Sicilia - P.IVA 01389680859</p>
        </div>
      </footer>
    </div>
  );
}
