"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Radio, Disc, Mic, Landmark } from 'lucide-react';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const stationName = process.env.NEXT_PUBLIC_STATION_NAME || "Radio RCS Sicilia";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const hero = PlaceHolderImages.find(img => img.id === 'about-hero');
  const banner = PlaceHolderImages.find(img => img.id === 'about-banner');

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 py-12 space-y-12">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">La Nostra Storia</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Dal 10 marzo 1979, {stationName} attraversa il tempo portando la musica nel cuore dell'isola e oltre ogni confine.
        </p>
      </div>

      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5">
        {banner && (
          <Image
            src={`${basePath}${banner.imageUrl}`}
            alt={banner.description}
            fill
            className="object-cover"
            data-ai-hint="radio studio professional"
            priority
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-morphism border-none">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
              <Disc size={24} />
            </div>
            <h3 className="font-bold text-xl">1979</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              L'epoca delle radio libere e dei giradischi. Nasce un sogno che ancora oggi non smette di suonare.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-none">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mx-auto">
              <Radio size={24} />
            </div>
            <h3 className="font-bold text-xl">Autonomia</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Negli anni '90 abbiamo conquistato la nostra identità, resistendo ai grandi network nazionali.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-none">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto">
              <Mic size={24} />
            </div>
            <h3 className="font-bold text-xl">Interviste</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Una storia ricca di incontri con i più grandi nomi dello spettacolo, della musica e della danza.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <p>
          {stationName} è una storica emittente radiofonica locale che, grazie alla potenza dello streaming digitale, è diventata una voce ascoltata con passione sia a livello Nazionale che Internazionale. 
        </p>
        <p>
          La nostra nascita risale al <strong>10 marzo 1979</strong>, in quegli anni pionieristici dove le frequenze erano territori da esplorare e i giradischi erano il motore di ogni trasmissione. Negli anni '80 siamo diventati la voce di una comunità intera, radicandoci profondamente nel territorio siciliano.
        </p>
        <p>
          Mentre gli anni '90 segnavano la chiusura di molte realtà locali, RCS ha saputo evolversi, mantenendo intatta la propria originalità e autonomia. Con l'avvento delle nuove tecnologie, abbiamo innalzato i nostri standard: oggi, due regie computerizzate garantiscono una programmazione musicale H24 con una qualità tecnica eccelsa.
        </p>
        <p>
          Il nostro palinsesto unisce i <strong>Grandi Successi</strong> che hanno segnato la storia della musica italiana e internazionale alle hit del momento, offrendo una colonna sonora completa per ogni generazione.
        </p>
      </div>

      <div className="pt-12 mt-12 border-t border-white/10">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground/60">
            <Landmark size={20} />
          </div>
          <div className="space-y-4 max-w-lg">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-primary italic">{stationName}</h2>
              <p className="text-lg font-medium">di Vancheri Salvatore</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground font-medium">
              <p className="bg-white/5 py-1 px-4 rounded-lg inline-block text-foreground/80">P. IVA 01389680859</p>
              <div className="flex flex-col gap-1 items-center pt-2">
                <span>Lic. SIAE 3824 del 15.01.2021</span>
                <span>Lic. SCF n° 1440/17</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}