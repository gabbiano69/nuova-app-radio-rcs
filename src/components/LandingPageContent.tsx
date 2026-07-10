
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Music, MessageCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPageContent() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://picsum.photos/seed/rcs/1200/800"
          alt="RCS Radio"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <Image
            src={`${basePath}/images/logo-aruba.png`}
            alt="RCS Logo"
            width={180}
            height={180}
            className="mx-auto mb-6 drop-shadow-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://picsum.photos/seed/logo/200/200';
            }}
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">RCS RADIO</h1>
          <p className="text-xl text-muted-foreground mb-8">La tua musica, ovunque tu sia.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="rounded-full px-8">
              <Link href="/player">
                <Play className="mr-2 h-5 w-5 fill-current" /> ASCOLTA ORA
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8">
              <Link href="/contact">CONTATTACI</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Chi Siamo</h2>
            <p className="text-muted-foreground leading-relaxed">
              RCS Radio è il punto di riferimento per chi ama la musica di qualità e l'informazione locale. 
              Trasmettiamo passione e intrattenimento ogni giorno.
            </p>
            <Button variant="link" asChild className="p-0 mt-4 text-primary">
              <Link href="/about">Scopri di più &rarr;</Link>
            </Button>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
            <Image src="https://picsum.photos/seed/studio/600/400" alt="Studio" fill className="object-cover" />
          </div>
        </div>

        {/* Social & Contact */}
        <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
          <h3 className="text-2xl font-bold mb-6">Seguici sui Social</h3>
          <div className="flex justify-center gap-6">
            <Link href="#" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
              <Facebook className="w-6 h-6" />
            </Link>
            <Link href="#" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
              <Instagram className="w-6 h-6" />
            </Link>
            <Link href="#" className="p-3 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
              <MessageCircle className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
