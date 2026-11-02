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
      content: 'Bonjour ! Je suis l\'Assistant Fiscal IA du cabinet Fidcogest. Posez-moi vos questions sur la fiscalité belge (ISOC, IPP, TVA, Peppol, déductibilité des frais ou création de SRL).'
    }
  ]);

  const quickPrompts = [
    'Taux réduit ISOC 20% : quelles conditions ?',
    'Facturation Peppol 2026 en Belgique',
    'Déduction véhicule hybride / électrique',
    'Dividendes VVPR-bis à 15%'
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
        content: data.answer || 'Analyse fiscale terminée.'
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Désolé, une erreur réseau est survenue. Veuillez réessayer ou contacter nos conseillers.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Assistant Launcher Button (Fixed Left-Bottom or Section Widget) */}
      <div className="fixed bottom-5 left-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 border border-amber-500/40 text-slate-100 font-medium shadow-2xl hover:border-amber-400 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold tracking-wide">
              Assistant Fiscal Belge (IA ITAA)
            </span>
          </button>
        )}
      </div>

      {/* Expanded Modal Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 left-5 z-50 w-[360px] sm:w-[420px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[520px] animate-in fade-in duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-white">Assistant Fiscal Belge</h4>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Alimenté par Gemini & Législation ITAA 2026
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-950/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs font-mono p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                Analyse fiscale des textes de loi belges en cours...
              </div>
            )}
          </div>

          {/* Quick chip prompts */}
          <div className="p-2 bg-slate-950 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/30 transition-colors"
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
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Posez une question sur vos impôts ou frais..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
