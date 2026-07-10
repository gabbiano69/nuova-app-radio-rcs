
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview Pagina obsoleta. La funzionalità è stata integrata nella landing page.
 * Esegue un redirect automatico alla home.
 */
export default function ObsoleteSloganPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return null;
}
