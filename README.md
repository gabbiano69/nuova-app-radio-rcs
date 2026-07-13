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

Per visualizzare i titoli delle canzoni e gli artisti in tempo reale (Metadati), l'app interroga il server della radio. Per evitare blocchi di sicurezza (CORS) e instabilità, utilizziamo un **Cloudflare Worker** come proxy ("ponte").

### ⚠️ IMPORTANTE PER ALTRE RADIO
Se utilizzi questo progetto per una stazione diversa, **DEVI modificare l'URL sorgente** nel codice del Worker. Se lasci quello attuale, l'app mostrerà i titoli di Radio RCS Sicilia.

### Guida passo-passo per principianti:
1. **Crea un account**: Vai su cloudflare.com (gratis).
2. **Crea il Worker**: Nella dashboard a sinistra clicca su Compute -> Workers & Pages -> Create application -> Create Worker.
3. **Nome e Deploy**: Dai un nome (es: proxy-metadati-radio) e clicca su Deploy.
4. **Inserisci il Codice**: Clicca su Edit Code, cancella tutto e incolla il codice JavaScript fornito per gestire le intestazioni Access-Control-Allow-Origin e puntare all'URL dei metadati (https://sr10.inmystream.it/proxy/radiorcs?mp=/7.html).
5. **Salva**: Clicca su Save and Deploy.
6. **Collega all'App**: Copia l'indirizzo che ti dà Cloudflare (es: https://proxy-metadati-radio.tuonome.workers.dev/) e incollalo nel file src/context/AudioContext.tsx alla variabile proxyUrl.

---

## 🚀 Pubblicazione e Deploy

Il sistema di build genera automaticamente tre pacchetti distinti. Dopo ogni salvataggio su GitHub, vai nella scheda **Actions**, clicca sull'ultimo lavoro completato e scarica l'artefatto **"Radio-RCS-Sicilia-FULL-DEPLOY"**.

### Cosa contiene il pacchetto:
1. **android-release/**: Contiene l'APK (per i tuoi test) e l'AAB per Google Play Store.
2. **web-root/**: Per installare la radio nel dominio principale (es. rcsradio.it). Include il file .htaccess per Aruba.
3. **web-subfolder-rcs/**: Per installare la radio in una sottocartella (es. rcsradio.it/rcs/).

---

## 🔐 Firma dell'App (Google Play)

Per generare un file AAB pronto per lo Store (non di "debug"), devi configurare i **Secrets** di GitHub. I Secrets sono come una cassaforte dove nascondiamo le password. Vai in Settings -> Secrets and variables -> Actions e aggiungi:

- ANDROID_KEYSTORE_BASE64: Il tuo file .jks trasformato in testo Base64.
- ANDROID_KEYSTORE_PASSWORD: La password della tua firma.
- ANDROID_KEY_ALIAS: Il nome (alias) della tua chiave.
- ANDROID_KEY_PASSWORD: La password della chiave.

Se non li configuri, GitHub creerà comunque un'app di prova (Debug) per i tuoi test personali.

---

## 📱 Ottimizzazioni Android (AndroidManifest.xml)
Per garantire che la radio non si spenga a schermo spento e che appaia la notifica nella tendina, abbiamo aggiunto i seguenti permessi:
- FOREGROUND_SERVICE e WAKE_LOCK: impediscono al telefono di interrompere l'app mentre suona.
- usesCleartextTraffic="true": permette lo streaming anche se il link della radio è in formato http.

---

## 🎨 Icone e Logo
L'icona dell'app e lo splash screen (schermata d'avvio) vengono creati automaticamente partendo dal file public/logo-rcs.png. Requisito: Il file deve essere un quadrato perfetto (consigliato 1024x1024px).

---
© 2024 **Radio RCS Sicilia** - *La Radio del Cuore della Sicilia*
