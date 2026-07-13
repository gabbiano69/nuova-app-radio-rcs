import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Forza Next.js a creare file HTML/CSS/JS fisici (fondamentale per Aruba e App)
  output: 'export',

  // 2. Aggiunge una barra finale ai link (es. /about/) 
  // Questo aiuta Aruba a trovare i file senza configurazioni complicate
  trailingSlash: true,

  // 3. Disabilita l'ottimizzazione immagini standard
  // I siti statici non possono ridimensionare le immagini al volo
  images: {
    unoptimized: true,
  },

  // 4. Gestisce dinamicamente la sottocartella /rcs
  // Viene pilotato dal file android-build.yml che abbiamo corretto
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

export default nextConfig;
