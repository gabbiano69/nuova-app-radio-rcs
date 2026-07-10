"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export function NewsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const timestamp = new Date().getTime();
        // Utilizziamo le API di rcsradio.it direttamente per le ultime news
        const response = await fetch(`https://www.rcsradio.it/wp-json/wp/v2/posts?_embed&per_page=3&_=${timestamp}`);
        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching WP posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Caricamento News...</p>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section id="news" className="w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
              <Newspaper size={14} /> Ultime Notizie
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">Dal nostro Blog</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Resta sempre aggiornato su musica, eventi e curiosità direttamente dalla nostra redazione.
            </p>
          </div>
          <a href="https://www.rcsradio.it" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-full border-black/10 hover:border-primary hover:bg-primary/5 px-6 font-bold">
              Tutte le news <ExternalLink size={16} className="ml-2" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://picsum.photos/seed/news/800/600';
            const cleanTitle = post.title.rendered.replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&#8230;/g, '...');
            const cleanExcerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 100) + '...';

            return (
              <Card key={post.id} className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group rounded-3xl overflow-hidden bg-muted/20">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image 
                    src={featuredImage} 
                    alt={cleanTitle} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <CardHeader className="p-8 pb-0">
                  <div className="text-[10px] font-bold text-primary mb-3 uppercase tracking-widest">
                    {new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                  </div>
                  <CardTitle className="line-clamp-2 text-2xl font-black leading-tight group-hover:text-primary transition-colors">
                    {cleanTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {cleanExcerpt}
                  </p>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="link" className="p-0 text-primary h-auto font-black uppercase text-[11px] tracking-widest group">
                      Leggi articolo <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
