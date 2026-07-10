# Radio RCS Sicilia - App Ufficiale

Benvenuto nel repository ufficiale di Radio RCS Sicilia. Questo progetto è un'applicazione Next.js moderna, progettata per lo streaming HD e l'interazione con gli ascoltatori, utilizzabile sia come sito web che come App Android (via Capacitor).

## ⚙️ Personalizzazione (White Label)

L'app è progettata per essere "White Label". Puoi personalizzare l'identità dell'intera applicazione semplicemente utilizzando un file `.env` o impostando le variabili d'ambiente nel tuo server/CI.

### Variabili supportate:
```env
NEXT_PUBLIC_STATION_NAME="Radio RCS Sicilia"
NEXT_PUBLIC_STATION_SLOGAN="I Grandi Successi"
NEXT_PUBLIC_STREAM_URL="https://sr10.inmystream.it/proxy/radiorcs?mp=/stream"
NEXT_PUBLIC_CONTACT_EMAIL="radiorcs@hotmail.it"
```

## 🚀 Pubblicazione e Deploy

Il sistema di build genera automaticamente tre pacchetti distinti per ogni esigenza. Dopo il completamento della GitHub Action, scarica l'artefatto **"Radio-RCS-Sicilia-FULL-DEPLOY"**.

### Cosa contiene il pacchetto:
1. **`android-release/`**: Contiene l'APK e l'AAB (`Radio-RCS-Sicilia.aab`). Carica il file AAB su Google Play Console.
2. **`web-root/`**: Da usare se installi la radio nel dominio principale (es. `rcsradio.it`).
3. **`web-subfolder-rcs/`**: Da usare se installi la radio in una sottocartella (es. `rcsradio.it/rcs/`).

## 🔐 Firma dell'App (Google Play)

Per generare un file AAB pronto per il Play Store (non di debug), devi configurare i **Secrets** nel tuo repository GitHub:

1. Genera un Keystore Android.
2. Convertilo in Base64: `base64 -w 0 your-keystore.jks`.
3. Aggiungi questi segreti in **Settings -> Secrets and variables -> Actions**:
   - `ANDROID_KEYSTORE_BASE64`: Il contenuto Base64 del tuo file `.jks`.
   - `ANDROID_KEYSTORE_PASSWORD`: La password del keystore.
   - `ANDROID_KEY_ALIAS`: L'alias della chiave.
   - `ANDROID_KEY_PASSWORD`: La password della chiave.

Se questi segreti non sono presenti, GitHub genererà comunque un file AAB di debug per i tuoi test.

---
&copy; Radio RCS Sicilia - La Radio del Cuore
