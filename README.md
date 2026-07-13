Radio RCS Sicilia - App Ufficiale
Benvenuto nel repository ufficiale di Radio RCS Sicilia. Questo progetto è un'applicazione Next.js moderna, progettata per lo streaming HD e l'interazione con gli ascoltatori, utilizzabile sia come sito web che come App Android (via Capacitor).
⚙️ Personalizzazione (White Label)
L'app è progettata per essere "White Label". Puoi personalizzare l'identità dell'intera applicazione semplicemente utilizzando un file .env o impostando le variabili d'ambiente nel tuo server/CI.
Variabili supportate:
code
Env
NEXT_PUBLIC_STATION_NAME="Radio RCS Sicilia"
NEXT_PUBLIC_STATION_SLOGAN="I Grandi Successi"
NEXT_PUBLIC_STREAM_URL="https://sr10.inmystream.it/proxy/radiorcs?mp=/stream"
NEXT_PUBLIC_CONTACT_EMAIL="radiorcs@hotmail.it"
📡 Gestione Metadati e CORS (Cloudflare Worker)
Per visualizzare i titoli delle canzoni e gli artisti in tempo reale (Metadati), l'app deve interrogare il server della radio. Tuttavia, per motivi di sicurezza (CORS), i browser e i sistemi moderni bloccano queste richieste se provengono direttamente dal sito web.
Per risolvere questo problema in modo professionale, stabile e gratuito, utilizziamo un Cloudflare Worker come proxy dedicato.
Procedura di configurazione:
Crea un account Cloudflare: Vai su cloudflare.com e registrati gratuitamente.
Accedi a Workers & Pages:
Nella dashboard principale, clicca sulla voce Compute nel menu a sinistra.
Seleziona Workers & Pages.
Crea un nuovo Worker:
Clicca sul tasto blu Create application (o Create Worker).
Dai un nome al tuo worker (es: metadata-rcs-proxy).
Clicca su Deploy.
Inserisci il codice del Proxy:
Clicca su Edit Code.
Cancella tutto il codice presente e incolla il seguente:
code
JavaScript
export default {
  async fetch(request, env, ctx) {
    const targetUrl = "https://sr10.inmystream.it/proxy/radiorcs?mp=/7.html";

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
      }
    });

    const newResponse = new Response(response.body, response);

    // Configurazione CORS per permettere all'app e al sito di leggere i dati
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS");
    newResponse.headers.set("Content-Type", "text/plain; charset=utf-8");

    return newResponse;
  },
};
Salva e Pubblica: Clicca su Save and Deploy.
Integrazione nell'App:
Cloudflare ti fornirà un link (es: https://metadata-rcs-proxy.nomeutente.workers.dev/).
Inserisci questo link nel file src/context/AudioContext.tsx alla variabile proxyUrl.
Vantaggi: Questa configurazione permette di avere fino a 100.000 richieste gratuite al giorno, garantendo che i titoli delle canzoni appaiano istantaneamente senza errori di timeout (Error 500/502).
🚀 Pubblicazione e Deploy
Il sistema di build gestito tramite GitHub Actions genera automaticamente tre pacchetti distinti per ogni esigenza. Dopo ogni aggiornamento del codice, visita la scheda Actions del repository e scarica l'artefatto "Radio-RCS-Sicilia-FULL-DEPLOY".
Cosa contiene il pacchetto:
android-release/: Contiene l'APK (per test) e l'AAB (Radio-RCS-Sicilia.aab) per la pubblicazione ufficiale.
web-root/: Da usare se installi la radio nel dominio principale (es. rcsradio.it). Include il file .htaccess ottimizzato per Aruba.
web-subfolder-rcs/: Da usare se installi la radio in una sottocartella (es. rcsradio.it/rcs/).
🔐 Firma dell'App (Google Play)
Per generare un file AAB pronto per il Play Store (non di debug), devi configurare i Secrets nel tuo repository GitHub in Settings -> Secrets and variables -> Actions:
ANDROID_KEYSTORE_BASE64: Il contenuto Base64 del tuo file .jks.
ANDROID_KEYSTORE_PASSWORD: La password del keystore.
ANDROID_KEY_ALIAS: L'alias della chiave.
ANDROID_KEY_PASSWORD: La password della chiave.
Se questi segreti non sono presenti, GitHub genererà comunque un file APK/AAB di debug per i tuoi test privati.
🎨 Asset Grafici
L'icona dell'app e lo splash screen vengono generati automaticamente durante la build partendo dal file public/logo-rcs.png. Per risultati ottimali, assicurati che il logo sia un file quadrato di almeno 1024x1024 pixel.
© 2024 Radio RCS Sicilia - La Radio del Cuore della Sicilia.
