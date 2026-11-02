import React, { useState } from 'react';
import { NEWS_ARTICLES } from '../data/mockData';
import { NewsArticle } from '../types';
import { FileText, Calendar, Clock, ArrowRight, X, ShieldCheck, Tag, BookOpen, Share2 } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Facturation Électronique', 'Fiscalité', 'Création d\'entreprise'];

  const filteredArticles = NEWS_ARTICLES.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Editorial Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">Doctrine &amp; Veille Législative • Belgique</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            Actualités &amp; Analyses Fiscales Belges
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Décryptage officiel de la législation fiscale, réformes ISOC &amp; IPP, facturation Peppol obligatoire et stratégies d'optimisation rédigées par nos experts-comptables certifiés ITAA.
          </p>
        </div>
      </section>

      {/* Category Filter Chips */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#142B45] text-white shadow-sm font-semibold'
                    : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45] hover:border-[#B79661]'
                }`}
              >
                {cat === 'all' ? 'Toutes les publications' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#6B7280] font-sans">
            Affichage de <span className="font-semibold text-[#142B45]">{filteredArticles.length}</span> article(s) certifié(s)
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="cabinet-card p-7 transition-all cursor-pointer flex flex-col justify-between space-y-6 group hover:-translate-y-1 hover:border-[#B79661]/60"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="px-2.5 py-1 rounded bg-[#F7F6F2] text-[#B79661] font-semibold border border-[#E8E6DF] text-[11px]">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#B79661]" /> {art.readTime}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#142B45] group-hover:text-[#B79661] transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-sm text-[#4B5563] leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between text-xs">
                <span className="text-[#6B7280] font-mono">{art.date}</span>
                <span className="text-[#142B45] font-semibold flex items-center gap-1.5 group-hover:text-[#B79661] group-hover:translate-x-1 transition-all">
                  Consulter l'analyse
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B45]/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden text-[#1F2937] my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E8E6DF] bg-[#F7F6F2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-semibold bg-white text-[#B79661] border border-[#B79661]/40 rounded-full">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#6B7280] flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#B79661]" /> {selectedArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#142B45] hover:bg-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[540px] overflow-y-auto leading-relaxed text-sm">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#142B45] leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6B7280] py-3 border-y border-[#E8E6DF] bg-[#F7F6F2]/50 px-4 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#4B5563]">Rédigé par :</span>
                  <span className="font-semibold text-[#142B45]">{selectedArticle.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#4B5563]">Publication :</span>
                  <span className="font-semibold text-[#142B45]">{selectedArticle.date}</span>
                </div>
                <span>•</span>
                <span className="text-[#B79661] font-semibold">Agrément ITAA 10.842.109</span>
              </div>

              <div className="text-[#374151] whitespace-pre-line leading-relaxed space-y-4 text-sm sm:text-base font-sans">
                {selectedArticle.content}
              </div>

              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-xs text-[#6B7280] space-y-1">
                <div className="font-semibold text-[#142B45] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B79661]" />
                  Avis de non-responsabilité professionnelle
                </div>
                <p>
                  Les analyses publiées reflètent l'état de la législation fiscale belge à la date d'émission. Chaque situation patrimoniale ou sociétaire nécessitant un examen particulier, nous vous recommandons de solliciter un entretien personnalisé avec nos associés.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F7F6F2] border-t border-[#E8E6DF] flex items-center justify-between">
              <div className="text-xs text-[#6B7280]">
                Cabinet Fidcogest • Expertise Comptable &amp; Conseil Fiscal
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-[#142B45] hover:bg-[#1D3B5C] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Fermer la lecture
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
