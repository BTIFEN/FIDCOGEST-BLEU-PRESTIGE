import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, ArrowRight, Calendar, Lock } from 'lucide-react';
import { useCabinet } from '../context/CabinetContext';

interface WhatsAppWidgetProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  isOpen: controlledIsOpen,
  onOpen,
  onClose,
  onOpenBooking,
  onOpenVault
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const { config } = useCabinet();
  const { cabinet } = config;

  const isControlled = typeof controlledIsOpen === 'boolean';
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (open) {
      if (onClose) onClose();
      else setInternalIsOpen(false);
    } else {
      if (onOpen) onOpen();
      else setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else setInternalIsOpen(false);
  };

  const phoneNumber = cabinet.mobile?.replace(/[^0-9]/g, '') || '32476626621';

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
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* Expanded WhatsApp Drawer */}
      {open && (
        <div className="pointer-events-auto mb-3 w-[calc(100vw-2rem)] max-w-[360px] sm:max-w-[380px] rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden text-[#1F2937] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#075E54] text-white flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center font-serif font-bold shadow-xs">
                  F
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#075E54]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide text-white">Fidcogest Direct</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1 font-sans font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                  Permanence WhatsApp ITAA
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="p-4 space-y-3 bg-[#F7F6F2] max-h-[360px] overflow-y-auto text-xs">
            <div className="bg-white border border-[#E8E6DF] rounded-2xl rounded-tl-none p-3 max-w-[92%] text-[#374151] shadow-xs leading-relaxed font-sans">
              <p className="font-serif font-bold text-[#142B45] mb-0.5">Bienvenue chez Fidcogest</p>
              <p>Comment notre équipe peut-elle vous conseiller aujourd'hui ?</p>
              <span className="text-xs text-[#6B7280] font-sans mt-1 block">
                Réponse pendant les heures d'ouverture du cabinet
              </span>
            </div>

            <p className="text-xs text-[#6B7280] font-semibold pt-1 uppercase tracking-wider">
              Sélectionnez un sujet rapide :
            </p>

            {/* Quick preset links */}
            <div className="space-y-1.5">
              {presetMessages.map((msg, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg.text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E8E6DF] hover:border-[#B79661] transition-all flex items-center justify-between group shadow-xs block"
                >
                  <span className="text-xs text-[#142B45] font-medium group-hover:text-[#8C6A34] transition-colors">
                    {msg.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#8C6A34] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </a>
              ))}
            </div>

            {/* Actions alternatives */}
            <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  handleClose();
                  onOpenBooking();
                }}
                className="text-[#142B45] font-semibold hover:text-[#8C6A34] flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Prendre rendez-vous</span>
              </button>
              <button
                onClick={() => {
                  handleClose();
                  onOpenVault();
                }}
                className="text-[#6B7280] hover:text-[#142B45] flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Espace client</span>
              </button>
            </div>
          </div>

          {/* Form input link */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customMsg.trim()) {
                window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMsg)}`, '_blank');
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
              className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white transition-colors shadow-xs cursor-pointer"
              title="Envoyer via WhatsApp"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}

      {/* Main Trigger Button - Official WhatsApp Green */}
      <button
        onClick={handleToggle}
        className="pointer-events-auto flex items-center justify-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold shadow-xl shadow-emerald-950/20 border-2 border-white/40 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
        aria-label="Contacter le cabinet par WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#25D366] animate-pulse" />
        </div>
        <span className="text-xs font-serif font-extrabold tracking-wide text-white hidden sm:inline-block">
          WhatsApp Cabinet
        </span>
      </button>
    </div>
  );
};
