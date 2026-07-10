"use client"

import React from 'react';
import { Youtube, Facebook, Instagram, ExternalLink, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlatformData {
  platform: string;
  icon: any;
  color: string;
  bg: string;
  link: string;
  description: string;
}

export function SocialGallery() {
  const SOCIAL_DATA: PlatformData[] = [
    {
      platform: 'YouTube',
      icon: Youtube,
      color: 'text-red-600',
      bg: 'bg-red-50',
      link: 'https://www.youtube.com/channel/UCTlKWIycsPc7Wh5cPW03vOA',
      description: 'Guarda le nostre interviste e i video delle dirette.'
    },
    {
      platform: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: 'https://www.facebook.com/RCS.radio',
      description: 'Resta aggiornato sui nostri eventi e interagisci con noi.'
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      link: 'https://www.instagram.com/radio_rcs_sicilia/',
      description: 'Scopri il dietro le quinte e i momenti più belli in radio.'
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
            <Video size={14} /> Social Multimedia
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">La Radio da Vedere</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Entra nel cuore della musica e degli eventi con i nostri canali social ufficiali.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOCIAL_DATA.map((platform) => (
            <a 
              key={platform.platform} 
              href={platform.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group"
            >
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-500 group-hover:-translate-y-2 bg-white h-full border border-slate-100">
                <CardContent className="p-10 flex flex-col items-center text-center gap-6">
                  <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110", platform.bg, platform.color)}>
                    <platform.icon size={32} />
                  </div>
                  <div className="space-y-4">
                    <h3 className={`text-3xl font-black uppercase tracking-tighter ${platform.color}`}>
                      {platform.platform}
                    </h3>
                    <p className="text-slate-600 font-semibold text-base leading-relaxed">
                      {platform.description}
                    </p>
                  </div>

                  <Button 
                    variant="outline" 
                    className={`w-full h-14 rounded-2xl font-bold border-2 transition-all flex items-center justify-center gap-2 text-lg border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-sm`}
                  >
                    Vai al Canale <ExternalLink size={20} />
                  </Button>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper per cn se non importato correttamente
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
