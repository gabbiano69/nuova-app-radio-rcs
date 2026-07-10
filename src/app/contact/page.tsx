"use client"

import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "radiorcs@hotmail.it";
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || "+39 333 862599";
  const address = process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Via Sandro Pertini snc, 93010 Serradifalco (CL)";
  const website = process.env.NEXT_PUBLIC_CONTACT_WEBSITE || "https://www.rcsradio.it";

  const contactInfo = [
    { icon: Globe, label: 'Sito Web', value: website.replace('https://', '').replace('www.', ''), href: website },
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    { icon: Phone, label: 'Telefono', value: phone, href: `tel:${phone.replace(/\s+/g, '')}` },
    { icon: MapPin, label: 'Sede', value: 'Serradifalco (CL)', href: `https://maps.google.com/?q=${encodeURIComponent(address)}` },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/RCS.radio' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/radio_rcs_sicilia/' },
    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/channel/UCTlKWIycsPc7Wh5cPW03vOA' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = formData.subject || "Contatto da App Radio";
    const body = `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMessaggio:\n${formData.message}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setTimeout(() => {
      window.location.href = mailtoUrl;
      setIsSubmitting(false);
      toast({
        title: "Invio in corso",
        description: "L'app di posta si aprirà tra un istante.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Contattaci</h1>
            <p className="text-xl text-muted-foreground">
              Siamo sempre pronti ad ascoltarti. Scrivici per pubblicità, dediche o informazioni.
            </p>
          </div>

          <div className="space-y-6">
            {contactInfo.map((info) => (
              <a key={info.label} href={info.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <info.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                  <p className="text-lg font-semibold">{info.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 space-y-4">
            <p className="font-bold text-lg">Seguici sui Social</p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="w-12 h-12 rounded-xl border-white/10 hover:bg-primary/20 hover:text-primary transition-all">
                    <social.icon size={20} />
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>

        <Card className="glass-morphism border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Inviaci un messaggio</CardTitle>
            <CardDescription className="text-slate-300">Ti risponderemo al più presto via email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="form-name" className="text-sm font-bold text-white uppercase tracking-wider ml-1">Nome *</label>
                  <Input 
                    id="form-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Il tuo nome" 
                    className="bg-white/5 border-white/20 h-12" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="form-email" className="text-sm font-bold text-white uppercase tracking-wider ml-1">Email *</label>
                  <Input 
                    id="form-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="latua@email.com" 
                    className="bg-white/5 border-white/20 h-12" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="form-subject" className="text-sm font-bold text-white uppercase tracking-wider ml-1">Oggetto</label>
                <Input 
                  id="form-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Richiesta brano, pubblicità..." 
                  className="bg-white/5 border-white/20 h-12" 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="form-message" className="text-sm font-bold text-white uppercase tracking-wider ml-1">Messaggio *</label>
                <Textarea 
                  id="form-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Scrivi qui il tuo messaggio..." 
                  className="min-h-[150px] bg-white/5 border-white/20" 
                  required
                />
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Prepara Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}