import React, { useState } from 'react';
import { MessageSquare, X, Send, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';

interface WhatsAppWidgetProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({ onOpenBooking, onOpenVault }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phoneNumber = '3225550188'; // Fidcogest WhatsApp Business number

  const presetMessages = [
    {
      title: 'Création de Société (SRL)',
      text: 'Bonjour Fidcogest, je souhaite créer une SRL en Belgique et j\'aimerais un renseignement sur le plan financier légal.'
    },
    {
      title: 'Question Fiscalité & TVA',
      text: 'Bonjour Fidcogest, j\'ai une question concernant la déductibilité de mes frais professionnels / ma déclaration TVA.'
    },
    {
      title: 'Dépôt de Pièces Comptables',
      text: 'Bonjour, je suis client Fidcogest et je souhaite transmettre mes pièces justificatives.'
    },
    {
      title: 'Demande de Devis Forfaitaire',
      text: 'Bonjour Fidcogest, j\'aimerais recevoir une proposition d\'honoraires adaptée à mon activité d\'indépendant / PME.'
    }
  ];

  const handleSendPreset = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    const encoded = encodeURIComponent(customMsg);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[350px] sm:w-[380px] rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-emerald-950/40 overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center font-display font-bold text-emerald-400 border border-emerald-500/40">
                  F
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-wide">Fidcogest WhatsApp Direct</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  Expert-Comptable ITAA en Ligne
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-4 space-y-3 bg-slate-950/80 max-h-[380px] overflow-y-auto text-xs">
            {/* Introductory speech bubble */}
            <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-3 max-w-[90%] text-slate-200 shadow-sm leading-relaxed">
              <p className="font-medium text-amber-300 mb-1">Bonjour ! 👋</p>
              <p>Bienvenue chez <strong>Fidcogest</strong>. Comment pouvons-nous vous assister aujourd'hui dans votre gestion comptable ou fiscale ?</p>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Réponse habituelle en moins de 15 minutes</span>
            </div>

            <p className="text-[11px] text-slate-400 font-mono pt-1 uppercase tracking-wider">Sélectionnez un sujet rapide :</p>

            {/* Quick preset chips */}
            <div className="space-y-2">
              {presetMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPreset(msg.text)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs text-slate-200 font-medium group-hover:text-emerald-400 transition-colors">
                    {msg.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Alternative actions */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
                className="text-amber-400 hover:underline font-medium"
              >
                📅 Réserver un rendez-vous
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenVault();
                }}
                className="text-slate-400 hover:text-white"
              >
                🔒 Dépôt de documents
              </button>
            </div>
          </div>

          {/* Form input */}
          <form onSubmit={handleSendCustom} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Écrivez votre message WhatsApp..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md shadow-emerald-900/30"
              title="Ouvrir WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-xl shadow-emerald-950/60 border border-emerald-400/30 transition-all hover:scale-105 active:scale-95 group"
        aria-label="Discuter sur WhatsApp Business"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 fill-current text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-emerald-600"></span>
        </div>
        <span className="text-xs font-semibold tracking-wide hidden sm:inline-block">
          Discuter sur WhatsApp
        </span>
      </button>
    </div>
  );
};
