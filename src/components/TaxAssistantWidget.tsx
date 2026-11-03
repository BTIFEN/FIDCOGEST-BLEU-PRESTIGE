import React, { useState } from 'react';
import { Sparkles, Send, Bot, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface TaxAssistantWidgetProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const TaxAssistantWidget: React.FC<TaxAssistantWidgetProps> = ({
  isOpen: controlledIsOpen,
  onOpen,
  onClose
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour. Je suis l\'Assistant Fiscal IA du cabinet Fidcogest. Posez-moi vos questions sur la fiscalité belge (ISOC 20%, IPP, TVA, facturation Peppol 2026, rémunération dirigeant ou passage en SRL).'
    }
  ]);

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

  const quickPrompts = [
    'Taux réduit ISOC 20% : conditions',
    'Peppol 2026 obligatoire en Belgique',
    'Déductibilité véhicule de société',
    'Régime dividendes VVPR-bis 15%'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || query;
    if (!prompt.trim()) return;

    const userMsg: Message = { role: 'user', content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tax-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          locale: 'fr'
        })
      });

      const data = await res.json();
      const botMsg: Message = {
        role: 'assistant',
        content: data.answer || 'Analyse fiscale complétée.'
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Une indisponibilité temporaire est survenue. Veuillez contacter directement nos conseillers au cabinet Fidcogest.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40">
      {/* Expanded Modal Window */}
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[360px] sm:max-w-[420px] rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden flex flex-col max-h-[500px] animate-in fade-in duration-200 text-[#1F2937]">
          {/* Header */}
          <div className="p-4 bg-[#065F46] text-white flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-serif font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide text-white">Assistant Fiscal Belge</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1 font-sans font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  Doctrine ITAA &amp; Fiscalité 2026
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

          {/* Chat Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-[#F7F6F2] max-h-[300px]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#142B45] text-[#D9BD8E] flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#142B45] text-white font-medium rounded-tr-none shadow-xs'
                      : 'bg-white border border-[#E8E6DF] text-[#374151] rounded-tl-none whitespace-pre-line shadow-xs font-sans'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-[#6B7280] text-xs font-sans p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B79661]" />
                <span>Recherche fiscale en cours...</span>
              </div>
            )}
          </div>

          {/* Quick Chip Prompts */}
          <div className="p-2 bg-white border-t border-[#E8E6DF] flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#FAF9F6] hover:bg-[#142B45] hover:text-white text-[#4B5563] border border-[#E8E6DF] transition-all text-xs cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-[#E8E6DF] flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posez votre question fiscale..."
              className="flex-1 bg-[#F7F6F2] border border-[#E8E6DF] rounded-xl px-3 py-2 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B79661] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-2 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white font-bold transition-colors shadow-xs cursor-pointer"
              title="Envoyer"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Concierge Launcher Button - Emerald Green */}
      {!open && (
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-[#059669] hover:bg-[#047857] text-white border-2 border-emerald-300/40 shadow-xl shadow-emerald-950/25 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          style={{ backgroundColor: '#059669', color: '#FFFFFF' }}
          aria-label="Ouvrir l'Assistant Fiscal Fidcogest"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <div className="text-left pr-1 hidden sm:block">
            <span className="block text-xs font-serif font-extrabold tracking-wide text-white">
              Assistant Fiscal
            </span>
            <span className="block text-xs text-emerald-100 font-sans font-semibold">
              Doctrine ITAA 2026
            </span>
          </div>
        </button>
      )}
    </div>
  );
};
