"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Phone, MapPin, User } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
          <Shield size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground italic">Ultimo aggiornamento: Marzo 2024</p>
      </div>

      <Card className="glass-morphism border-none">
        <CardHeader>
          <CardTitle>Informativa sulla Privacy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none text-sm leading-relaxed space-y-8">
          <section className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <User size={20} /> Titolare del Trattamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
              <div className="space-y-1">
                <p className="font-bold">Radio RCS Sicilia</p>
                <p>di Vancheri Salvatore</p>
                <p>P. IVA 01389680859</p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> via Sandro Pertini snc, 93010 Serradifalco (CL)</p>
                <p className="flex items-center gap-2"><Mail size={16} className="text-primary" /> radiorcs@hotmail.it</p>
                <p className="flex items-center gap-2"><Phone size={16} className="text-primary" /> +39 333 862599 / 392 8627847</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-primary">1. Introduzione</h3>
            <p>Radio RCS Sicilia si impegna a proteggere la tua privacy. Questa informativa spiega come gestiamo le informazioni all'interno dell'applicazione ufficiale e del sito web, in conformità con il Regolamento UE 2016/679 (GDPR).</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-primary">2. Dati Raccolti</h3>
            <p>La nostra applicazione è progettata per lo streaming audio e non raccoglie dati personali identificativi (come nome, indirizzo o contatti) in modo automatico. Non utilizziamo cookie di profilazione nell'app.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-primary">3. Servizi di Terze Parti</h3>
            <p>Per fornire lo streaming e i metadati (titoli delle canzoni), l'app si connette ai server di InMyStream e Apple iTunes (per le copertine). Questi servizi possono ricevere l'indirizzo IP del dispositivo per consentire la trasmissione dei dati audio, ma Radio RCS Sicilia non archivia tali informazioni per scopi di marketing.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-primary">4. Modulo Contatti</h3>
            <p>Se utilizzi il modulo contatti, i dati inviati (nome, email, messaggio) vengono utilizzati esclusivamente per rispondere alla tua richiesta e non vengono ceduti a terzi né utilizzati per invio di newsletter non richieste.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-primary">5. Diritti dell'Interessato</h3>
            <p>Ai sensi del GDPR, hai il diritto di accedere ai tuoi dati, chiederne la rettifica, la cancellazione o la limitazione del trattamento. Per qualsiasi richiesta relativa alla tua privacy, puoi scrivere al Titolare all'indirizzo email: <strong>radiorcs@hotmail.it</strong>.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
