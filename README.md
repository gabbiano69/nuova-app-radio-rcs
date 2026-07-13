# 📻 Radio RCS Sicilia - App Ufficiale

Benvenuto nel repository ufficiale di **Radio RCS Sicilia**. Questo progetto è un'applicazione Next.js moderna, progettata per lo streaming HD e l'interazione con gli ascoltatori, utilizzabile sia come sito web che come App Android (via Capacitor).

---

## ⚙️ Personalizzazione (White Label)

L'app è progettata per essere "White Label". Puoi personalizzare l'identità dell'intera applicazione semplicemente utilizzando un file .env o impostando le variabili d'ambiente nel tuo server/CI.

### Variabili supportate:
- NEXT_PUBLIC_STATION_NAME="Radio RCS Sicilia"
- NEXT_PUBLIC_STATION_SLOGAN="I Grandi Successi"
- NEXT_PUBLIC_STREAM_URL="https://sr10.inmystream.it/proxy/radiorcs?mp=/stream"
- NEXT_PUBLIC_CONTACT_EMAIL="radiorcs@hotmail.it"

---

## 📡 Gestione Metadati e CORS (Cloudflare Worker)

Per visualizzare i titoli delle canzoni e gli artisti in tempo reale (Metadati), l'app deve interrogare il server della radio. Per garantire stabilità ed evitare blocchi di sicurezza (CORS), utilizziamo un **Cloudflare Worker** come proxy dedicato.

### Procedura di configurazione:

1. **Crea un account Cloudflare**: Vai su cloudflare.com e registrati gratuitamente.
2. **Accedi a Workers & Pages**: Clicca su **Compute** e poi su **Workers & Pages**.
3. **Crea un nuovo Worker**: Clicca su **Create application** -> **Create Worker**. Dai un nome (es: metadata-rcs-proxy) e clicca su **Deploy**.
4. **Inserisci il codice**: Clicca su **Edit Code**, cancella tutto e incolla il codice JavaScript che trovi nella documentazione tecnica per gestire il fetch dei metadati.
5. **Salva**: Clicca su **Save and Deploy**.
6. **Integrazione**: Copia il link generato (es: https://metadata-rcs-proxy.tuonome.workers.dev/) e inseriscilo nel file AudioContext.tsx.

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

*   ANDROID_KEYSTORE_BASE64: Il file .jks convertito in Base64.
*   ANDROID_KEYSTORE_PASSWORD: Password del keystore.
*   ANDROID_KEY_ALIAS: Alias della chiave.
*   ANDROID_KEY_PASSWORD: Password della chiave.

---

## 🎨 Asset Grafici
L'icona dell'app e lo splash screen vengono rigenerati automaticamente ad ogni build partendo dal file public/logo-rcs.png. Assicurati che l'immagine sia quadrata (1024x1024px).

---
© 2024 **Radio RCS Sicilia** - *La Radio del Cuore della Sicilia*
