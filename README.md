# 📻 Radio RCS Sicilia - App Ufficiale

Benvenuto nel repository ufficiale di **Radio RCS Sicilia**. Questo progetto è un'applicazione Next.js moderna, progettata per lo streaming HD e l'interazione con gli ascoltatori, utilizzabile sia come sito web che come App Android (via Capacitor).

---

## ⚙️ Personalizzazione (White Label)

L'app è progettata per essere "White Label". Puoi personalizzare l'identità dell'intera applicazione semplicemente utilizzando un file `.env` o impostando le variabili d'ambiente nel tuo server/CI.

### Variabili supportate:
- `NEXT_PUBLIC_STATION_NAME="Radio RCS Sicilia"`
- `NEXT_PUBLIC_STATION_SLOGAN="I Grandi Successi"`
- `NEXT_PUBLIC_STREAM_URL="https://sr10.inmystream.it/proxy/radiorcs?mp=/stream"`
- `NEXT_PUBLIC_CONTACT_EMAIL="radiorcs@hotmail.it"`

---

## 📡 Gestione Metadati e CORS (Cloudflare Worker)

Per visualizzare i titoli delle canzoni in tempo reale, l'app interroga il server della radio. Per evitare blocchi di sicurezza (CORS) e instabilità dei proxy pubblici, utilizziamo un **Cloudflare Worker** come proxy privato.

### ⚠️ ATTENZIONE PER ALTRE RADIO
Se utilizzi questo repository per una stazione radio differente, **DEVI modificare l'URL sorgente** nel codice del Worker (punto 4 qui sotto). Se lasci quello attuale, l'app mostrerà i titoli delle canzoni di Radio RCS Sicilia.

### 1. Configurazione del Worker su Cloudflare:
1. Accedi a cloudflare.com e vai su **Compute** -> **Workers & Pages**.
2. Clicca su **Create application** -> **Create Worker**.
3. Nome Worker: `metadata-rcs-proxy` -> Clicca su **Deploy**.
4. Clicca su **Edit Code**, cancella tutto e incolla questo:

export default {
  async fetch(request, env, ctx) {
    // URL SORGENTE DEI METADATI (DA CAMBIARE SE USI UN'ALTRA RADIO)
    const targetUrl = "https://sr10.inmystream.it/proxy/radiorcs?mp=/7.html";

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
      }
    });

    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    newResponse.headers.set("Content-Type", "text/plain; charset=utf-8");

    return newResponse;
  },
};

5. Clicca su **Save and Deploy**.
6. **Integrazione**: Copia il link pubblico (es: https://metadata-rcs-proxy.tuonome.workers.dev/) e incollalo nel file `src/context/AudioContext.tsx` alla variabile `proxyUrl`.

---

## 🚀 Pubblicazione e Deploy

Il sistema di build genera automaticamente tre pacchetti distinti. Dopo ogni aggiornamento, scarica l'artefatto **"Radio-RCS-Sicilia-FULL-DEPLOY"** dalla scheda **Actions** di GitHub.

### Cosa contiene il pacchetto:
*   **android-release/**: Contiene l'APK (per test) e l'AAB per il Play Store.
*   **web-root/**: Da usare per l'installazione nel dominio principale (es. rcsradio.it).
*   **web-subfolder-rcs/**: Da usare per l'installazione in una sottocartella (es. rcsradio.it/rcs/).

---

## 🔐 Firma dell'App (Google Play)

Per generare un file AAB pronto per lo Store, configura i **Secrets** in Settings -> Secrets and variables -> Actions:
- `ANDROID_KEYSTORE_BASE64`: Il file .jks in Base64.
- `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.

---

## 🎨 Asset Grafici
L'icona dell'app e lo splash screen vengono rigenerati automaticamente partendo dal file `public/logo-rcs.png`. Assicurati che l'immagine sia quadrata (1024x1024px).

---
© 2024 **Radio RCS Sicilia** - *La Radio del Cuore della Sicilia*
