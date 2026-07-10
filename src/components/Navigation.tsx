
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Globe, Info, MessageSquare, Home, Facebook, Instagram, Youtube, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isApp = process.env.NEXT_PUBLIC_IS_APP === 'true';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    {
      href: '/',
      label: isApp ? 'Radio' : 'Home',
      icon: isApp ? Radio : Home,
    },
    {
      href: isApp ? '/sito-web/' : '/player/',
      label: isApp ? 'Sito Web' : 'OnAir',
      icon: isApp ? Globe : Radio,
    },
    {
      href: '/about/',
      label: 'Chi Siamo',
      icon: Info,
    },
    {
      href: '/contact/',
      label: 'Contatti',
      icon: MessageSquare,
    },
    {
      href: '/privacy/',
      label: 'Privacy',
      icon: Shield,
    },
  ];

  const socials = [
    { icon: Facebook, href: 'https://www.facebook.com/RCS.radio', color: 'hover:text-blue-500' },
    { icon: Instagram, href: 'https://www.instagram.com/radio_rcs_sicilia/', color: 'hover:text-pink-500' },
    { icon: Youtube, href: 'https://www.youtube.com/channel/UCTlKWIycsPc7Wh5cPW03vOA', color: 'hover:text-red-500' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 h-16">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-full flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '') + '/';
            const normalizedHref = item.href === '/' ? '/' : item.href.replace(/\/$/, '') + '/';
            const isActive = normalizedPath === normalizedHref;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium uppercase tracking-wider hidden xs:block">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-4">
          {socials.map((social, idx) => (
            <a 
              key={idx} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn("text-muted-foreground transition-colors p-1.5", social.color)}
            >
              <social.icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
