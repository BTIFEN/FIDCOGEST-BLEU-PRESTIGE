import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, X, ShieldCheck, ChevronRight } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const TaxAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour. Je suis l\'Assistant Fiscal IA du cabinet Fidcogest. Posez-moi vos questions sur la législation fiscale belge (ISOC, IPP, TVA, facturation Peppol 2026, déductibilité des frais professionnels ou constitution de société).'
    }
  ]);

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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Une indisponibilité temporaire est survenue. Veuillez reformuler votre question ou contacter directement nos conseillers fiscaux au cabinet.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Concierge Launcher Button */}
      <div className="fixed bottom-5 left-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#142B45] text-white border border-[#B79661]/60 shadow-xl hover:bg-[#1D3B5C] transition-all hover:scale-105 active:scale-95 group"
            aria-label="Ouvrir l'Assistant Fiscal Fidcogest"
          >
            <div className="w-8 h-8 rounded-full bg-[#B79661] text-[#142B45] flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-left pr-1">
              <span className="block text-xs font-serif font-bold tracking-wide">
                Assistant Fiscal Belge
              </span>
              <span className="block text-[10px] text-[#B79661] font-sans">
                ITAA &amp; Législation 2026
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Expanded Modal Concierge Window */}
      {isOpen && (
        <div className="fixed bottom-5 left-5 z-50 w-[360px] sm:w-[420px] rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden flex flex-col max-h-[540px] animate-in fade-in duration-200 text-[#1F2937]">
          {/* Header */}
          <div className="p-4 bg-[#142B45] text-white flex items-center justify-between border-b border-[#B79661]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#B79661] text-[#142B45] flex items-center justify-center font-serif font-bold shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm tracking-wide">Assistant Fiscal Belge</h4>
                <p className="text-[10px] text-[#B79661] flex items-center gap-1 font-sans">
                  <ShieldCheck className="w-3 h-3" />
                  Alimenté par la doctrine fiscale ITAA
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-[#F7F6F2]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#142B45] text-[#B79661] flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
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
                Consultation de la législation fiscale belge en cours...
              </div>
            )}
          </div>

          {/* Quick Chip Prompts */}
          <div className="p-2.5 bg-white border-t border-[#E8E6DF] flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-[#F7F6F2] hover:bg-[#142B45] hover:text-white text-[#4B5563] border border-[#E8E6DF] transition-all text-xs"
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
            className="p-3 bg-white border-t border-[#E8E6DF] flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posez une question fiscale ou comptable..."
              className="flex-1 bg-[#F7F6F2] border border-[#E8E6DF] rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#B79661] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-2.5 rounded-xl bg-[#142B45] hover:bg-[#1D3B5C] disabled:opacity-40 text-[#B79661] font-bold transition-colors shadow-xs"
              title="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
