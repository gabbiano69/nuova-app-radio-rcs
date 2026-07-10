"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Music, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InteractiveSection() {
  const { toast } = useToast();
  const [minDateTime, setMinDateTime] = useState('');
  
  const [contactData, setContactData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const [dedicationData, setDedicationData] = useState({
    name: '',
    song: '',
    message: '',
    dateTime: ''
  });

  useEffect(() => {
    const calculateMinDate = () => {
      const now = new Date();
      now.setHours(now.getHours() + 24);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    setMinDateTime(calculateMinDate());
  }, []);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "radiorcs@hotmail.it";
    const subject = contactData.subject || "Contatto da App/Sito";
    const body = `Nome: ${contactData.name}\n\nMessaggio:\n${contactData.message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast({
      title: "Email in preparazione",
      description: "L'app di posta si aprirà tra un istante.",
    });
    setContactData({ name: '', subject: '', message: '' });
  };

  const handleSubmitDedication = (e: React.FormEvent) => {
    e.preventDefault();
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "radiorcs@hotmail.it";
    const formattedDate = new Date(dedicationData.dateTime).toLocaleString('it-IT');
    const subject = "Nuova Dedica Musicale";
    const body = `Nome: ${dedicationData.name}\nBrano: ${dedicationData.song}\nProgrammazione: ${formattedDate}\n\nMessaggio:\n${dedicationData.message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    toast({
      title: "Dedica in preparazione",
      description: "L'app di posta si aprirà tra un istante.",
    });
    setDedicationData({ name: '', song: '', message: '', dateTime: '' });
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">Area Interattiva</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Entra in contatto con noi. Richiedi i tuoi brani preferiti o scrivi direttamente in redazione.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-950 text-white">
            <CardHeader className="p-10 pb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-4">
                <MessageSquare size={14} /> Redazione
              </div>
              <CardTitle className="text-3xl font-black">Scrivici</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="c-name" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-white/50">Nome *</label>
                  <Input 
                    id="c-name"
                    name="name"
                    value={contactData.name}
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    placeholder="Il tuo nome" 
                    className="h-12 bg-white/5 border-white/10 rounded-xl" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="c-subject" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-white/50">Oggetto</label>
                  <Input 
                    id="c-subject"
                    name="subject"
                    value={contactData.subject}
                    onChange={(e) => setContactData({...contactData, subject: e.target.value})}
                    placeholder="Pubblicità, informazioni..." 
                    className="h-12 bg-white/5 border-white/10 rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="c-message" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-white/50">Messaggio *</label>
                  <Textarea 
                    id="c-message"
                    name="message"
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    placeholder="Scrivi qui..." 
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-xl" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary font-bold text-lg hover:scale-105 transition-all">
                  Invia Email <Send size={20} className="ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100">
            <CardHeader className="p-10 pb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/5 text-slate-950 text-[10px] font-black tracking-widest uppercase mb-4">
                <Music size={14} /> Dediche
              </div>
              <CardTitle className="text-3xl font-black text-slate-950">Invia una Dedica</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
              <form onSubmit={handleSubmitDedication} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="d-name" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400">Tuo Nome *</label>
                    <Input 
                      id="d-name"
                      name="name"
                      value={dedicationData.name}
                      onChange={(e) => setDedicationData({...dedicationData, name: e.target.value})}
                      placeholder="Nome" 
                      className="h-12 bg-white border-slate-200 rounded-xl text-slate-950" 
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="d-time" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400">Quando *</label>
                    <Input 
                      id="d-time"
                      name="dateTime"
                      type="datetime-local"
                      min={minDateTime}
                      value={dedicationData.dateTime}
                      onChange={(e) => setDedicationData({...dedicationData, dateTime: e.target.value})}
                      className="h-12 bg-white border-slate-200 rounded-xl text-slate-950" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="d-song" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400">Brano e Artista *</label>
                  <Input 
                    id="d-song"
                    name="song"
                    value={dedicationData.song}
                    onChange={(e) => setDedicationData({...dedicationData, song: e.target.value})}
                    placeholder="Cosa vuoi ascoltare?" 
                    className="h-12 bg-white border-slate-200 rounded-xl text-slate-950" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="d-message" className="text-[10px] font-bold uppercase tracking-widest ml-1 text-slate-400">Messaggio / Dedica</label>
                  <Textarea 
                    id="d-message"
                    name="message"
                    value={dedicationData.message}
                    onChange={(e) => setDedicationData({...dedicationData, message: e.target.value})}
                    placeholder="Scrivi qui la tua dedica..." 
                    className="min-h-[100px] bg-white border-slate-200 rounded-xl text-slate-950" 
                  />
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl bg-slate-950 font-bold text-lg hover:scale-105 transition-all">
                  Invia Dedica <Send size={20} className="ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
