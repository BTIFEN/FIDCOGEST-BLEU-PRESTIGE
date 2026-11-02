import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Send, CheckCircle2 } from 'lucide-react';

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
  const [activeOffice, setActiveOffice] = useState<'bruxelles' | 'mons'>('bruxelles');

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Demande de Rendez-vous',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-12 font-sans">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300">
          <Phone className="w-4 h-4 text-amber-400" />
          <span>Permanence Accueillante • Bruxelles &amp; Mons</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Contact, Accès &amp; Localisation
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Prenez contact directement avec nos conseillers fiscaux certifiés ITAA ou venez nous rencontrer au cabinet.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Office Coordinates & Interactive Map Selector */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office Switcher Tabs */}
            <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveOffice('bruxelles')}
                className={`flex-1 py-2.5 rounded-lg transition-colors font-bold ${
                  activeOffice === 'bruxelles'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Siège Bruxelles (Louise)
              </button>
              <button
                onClick={() => setActiveOffice('mons')}
                className={`flex-1 py-2.5 rounded-lg transition-colors font-bold ${
                  activeOffice === 'mons'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Implantation Mons (Wallonie)
              </button>
            </div>

            {/* Selected Office Details Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-display font-bold text-base text-white">
                  {activeOffice === 'bruxelles' ? 'Cabinet Fidcogest Bruxelles' : 'Cabinet Fidcogest Mons'}
                </h3>
                <span className="px-2 py-0.5 font-mono text-[10px] bg-amber-950 text-amber-300 border border-amber-800 rounded">
                  ITAA 10.842.109
                </span>
              </div>

              <div className="space-y-3 font-mono text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Adresse physique :</span>
                    <span>{activeOffice === 'bruxelles' ? 'Avenue Louise 240, 1050 Bruxelles' : 'Boulevard Dolez 12, 7000 Mons'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ligne téléphonique directe :</span>
                    <a href={`tel:${activeOffice === 'bruxelles' ? '+3225550188' : '+3265330211'}`} className="text-emerald-400 font-bold hover:underline">
                      {activeOffice === 'bruxelles' ? '+32 2 555 01 88' : '+32 65 33 02 11'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email secrétariat :</span>
                    <a href="mailto:contact@fidcogest.be" className="text-slate-200 hover:underline">
                      contact@fidcogest.be
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Horaires d'ouverture :</span>
                    <span>Lundi au Vendredi : 08h30 - 18h00 (sur rendez-vous)</span>
                  </div>
                </div>
              </div>

              {/* Map Canvas Visual Placeholder */}
              <div className="relative h-48 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <MapPin className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                  <div className="font-bold text-white text-xs">
                    {activeOffice === 'bruxelles' ? 'Bruxelles Louise (Avenue Louise 240)' : 'Mons Dolez (Boulevard Dolez 12)'}
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${activeOffice === 'bruxelles' ? 'Avenue+Louise+240+Bruxelles' : 'Boulevard+Dolez+12+Mons'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] font-mono rounded hover:bg-amber-400 transition-colors"
                  >
                    Ouvrir dans Google Maps ↗
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Secure Contact Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="font-display font-bold text-lg text-white">Formulaire de Contact Sécurisé SSL</h3>
              <p className="text-xs text-slate-400 font-mono">Transmission directe au secrétariat du cabinet Fidcogest</p>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-4 rounded-xl bg-slate-950 border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-lg text-white">Votre Message a été Transmis avec Succès</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Un gestionnaire de dossier du cabinet Fidcogest analysera votre demande et vous recontactera sous <strong className="text-amber-400">24 heures ouvrées</strong>.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Nom &amp; Prénom *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Nom de la Société / Numéro BCE</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="SRL Dupont Services (si applicable)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 mb-1">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean.dupont@entreprise.be"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Numéro de Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+32 470 00 00 00"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Sujet de votre demande *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Demande de Rendez-vous">Demande de Rendez-vous avec un Expert</option>
                    <option value="Demande de Devis Honoraires">Demande de Devis Honoraires Forfaitaires</option>
                    <option value="Création de Société / Plan Financier">Création de Société (SRL) &amp; Plan Financier</option>
                    <option value="Question TVA / Peppol 2026">Question TVA / Facturation Peppol 2026</option>
                    <option value="Autre demande">Autre sujet d'ordre comptable ou fiscal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Message détaillé *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Saisissez ici les détails de votre demande ou vos questions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    🔒 Vos données restent confidentielles sous le secret professionnel ITAA.
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer le Message
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
