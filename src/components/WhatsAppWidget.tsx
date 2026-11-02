import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, ArrowRight, Calendar, Lock } from 'lucide-react';

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

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-none">
      {/* Expanded WhatsApp Drawer */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[350px] sm:w-[380px] rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden text-[#1F2937] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#142B45] text-white flex items-center justify-between border-b border-[#B79661]/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#B79661] text-[#142B45] flex items-center justify-center font-serif font-bold shadow-xs">
                  F
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#142B45]"></span>
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide">Fidcogest Direct</h4>
                <p className="text-[11px] text-[#B79661] flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-3 h-3" />
                  Permanence Fiscale ITAA
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-4 space-y-3 bg-[#F7F6F2] max-h-[380px] overflow-y-auto text-xs">
            {/* Introductory speech bubble */}
            <div className="bg-white border border-[#E8E6DF] rounded-2xl rounded-tl-none p-3.5 max-w-[92%] text-[#374151] shadow-xs leading-relaxed font-sans">
              <p className="font-serif font-bold text-[#142B45] mb-1">Bienvenue chez Fidcogest</p>
              <p>Comment nos conseillers fiscaux certifiés ITAA peuvent-ils vous accompagner aujourd'hui ?</p>
              <span className="text-[10px] text-[#6B7280] font-sans mt-1.5 block">
                Réponse habituelle en moins de 15 minutes ouvrées
              </span>
            </div>

            <p className="text-[11px] text-[#6B7280] font-semibold pt-1 uppercase tracking-wider">
              Sélectionnez un sujet rapide :
            </p>

            {/* Quick preset links */}
            <div className="space-y-2">
              {presetMessages.map((msg, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F7F6F2] border border-[#E8E6DF] hover:border-[#B79661] transition-all flex items-center justify-between group shadow-xs block"
                >
                  <span className="text-xs text-[#142B45] font-medium group-hover:text-[#B79661] transition-colors">
                    {msg.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#B79661] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              ))}
            </div>

            {/* Alternative Cabinet actions */}
            <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenBooking();
                }}
                className="text-[#142B45] font-semibold hover:text-[#B79661] flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B79661]" />
                Prendre rendez-vous
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenVault();
                }}
                className="text-[#6B7280] hover:text-[#142B45] flex items-center gap-1"
              >
                <Lock className="w-3.5 h-3.5 text-[#B79661]" />
                Dépôt sécurisé
              </button>
            </div>
          </div>

          {/* Form input link */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customMsg.trim()) {
                window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMsg)}`;
                setCustomMsg('');
              }
            }}
            className="p-3 bg-white border-t border-[#E8E6DF] flex items-center gap-2"
          >
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Écrivez votre message WhatsApp..."
              className="flex-1 bg-[#F7F6F2] border border-[#E8E6DF] rounded-xl px-3 py-2 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B79661]"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#142B45] hover:bg-[#1D3B5C] text-[#B79661] transition-colors shadow-xs"
              title="Envoyer via WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#142B45] hover:bg-[#1D3B5C] text-white font-medium shadow-xl border border-[#B79661]/40 transition-all hover:scale-105 active:scale-95 group"
        aria-label="Contacter le cabinet par WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-[#B79661]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#142B45]"></span>
        </div>
        <span className="text-xs font-serif font-bold tracking-wide hidden sm:inline-block">
          WhatsApp Cabinet
        </span>
      </button>
    </div>
  );
};
