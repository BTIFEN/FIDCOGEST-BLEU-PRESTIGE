import React, { useState } from 'react';
import { NEWS_ARTICLES, TAX_DEADLINES_2026 } from '../data/mockData';
import { NewsArticle } from '../types';
import { FileText, Calendar, Clock, ArrowRight, X, ShieldCheck, Tag, BookOpen, Share2, HelpCircle } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeadlineCategory, setSelectedDeadlineCategory] = useState<string>('all');

  const categories = ['all', 'Facturation Électronique', 'Fiscalité', 'Création d\'entreprise'];
  const deadlineCategories = ['all', 'TVA', 'ISOC', 'IPP', 'Fiches 281'];

  const filteredArticles = NEWS_ARTICLES.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const filteredDeadlines = TAX_DEADLINES_2026.filter((d) => {
    if (selectedDeadlineCategory === 'all') return true;
    return d.category === selectedDeadlineCategory;
  });

  return (
    <div className="space-y-16 pb-20 font-sans">
      
      {/* Editorial Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">Doctrine &amp; Veille Législative • Belgique</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            Actualités &amp; Calendrier Fiscal Officiel Belge
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Décryptage officiel de la législation fiscale belge, réformes ISOC &amp; IPP, facturation Peppol obligatoire et échéancier complet 2026 certifié ITAA.
          </p>
        </div>
      </section>

      {/* SECTION 1 : CALENDRIER FISCAL COMPLET 2026 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6DF] pb-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
              Échéancier Annuel Officiel
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
              Calendrier Fiscal Complet de la Belgique 2026
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Consultez l'ensemble des échéances légales TVA, ISOC, IPP et comptes annuels BNB.
            </p>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-xl border border-[#E8E6DF] text-xs shadow-xs">
            {deadlineCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedDeadlineCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  selectedDeadlineCategory === cat
                    ? 'bg-[#142B45] text-white shadow-xs font-semibold'
                    : 'text-[#4B5563] hover:text-[#142B45] hover:bg-[#F7F6F2]'
                }`}
              >
                {cat === 'all' ? 'Toutes les échéances' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille complète des échéances */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeadlines.map((dl) => (
            <div
              key={dl.id}
              className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                dl.isUrgent
                  ? 'border-[#B79661] ring-1 ring-[#B79661]/30'
                  : 'border-[#E8E6DF]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#FAF9F6] text-[#8C6A34] border border-[#E8E6DF]">
                    {dl.category}
                  </span>
                  <span className="text-xs font-semibold text-[#142B45] flex items-center gap-1.5 bg-[#F7F6F2] px-2.5 py-0.5 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-[#B79661]" /> {dl.dueDate}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#142B45]">{dl.title}</h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">{dl.description}</p>
              </div>

              <div className="pt-3 border-t border-[#F1EFEA] flex items-center justify-between text-xs text-[#4B5563]">
                <span>Périodicité : <strong className="text-[#142B45]">{dl.period}</strong></span>
                <span className="text-xs text-[#8C6A34] font-medium">SPF Finances / BNB</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 : ARTICLES & ANALYSES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
          <div>
            <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
              Analyses &amp; Publications
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-0.5">
              Articles d'expertise fiscale et sociétaire
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#142B45] text-white shadow-sm font-semibold'
                    : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45] hover:border-[#B79661]'
                }`}
              >
                {cat === 'all' ? 'Toutes les publications' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="cabinet-card p-7 transition-all cursor-pointer flex flex-col justify-between space-y-6 group hover:-translate-y-1 hover:border-[#B79661]/60"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span className="px-2.5 py-1 rounded bg-[#F7F6F2] text-[#8C6A34] font-semibold border border-[#E8E6DF] text-xs">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[#4B5563]">
                    <Clock className="w-3.5 h-3.5 text-[#B79661]" /> {art.readTime}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#142B45] group-hover:text-[#8C6A34] transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between text-xs">
                <span className="text-[#4B5563] font-mono">{art.date}</span>
                <span className="text-[#142B45] font-semibold flex items-center gap-1.5 group-hover:text-[#8C6A34] group-hover:translate-x-1 transition-all">
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
                <span className="px-3 py-1 text-xs font-semibold bg-white text-[#8C6A34] border border-[#B79661]/40 rounded-full">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#4B5563] flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#B79661]" /> {selectedArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#142B45] hover:bg-white transition-colors cursor-pointer"
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

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#4B5563] py-3 border-y border-[#E8E6DF] bg-[#F7F6F2]/50 px-4 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#4B5563]">Rédigé par :</span>
                  <span className="font-semibold text-[#142B45]">{selectedArticle.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#4B5563]">Publication :</span>
                  <span className="font-semibold text-[#142B45]">{selectedArticle.date}</span>
                </div>
              </div>

              <div className="text-[#374151] whitespace-pre-line leading-relaxed space-y-4 text-sm sm:text-base font-sans">
                {selectedArticle.content}
              </div>

              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] text-xs text-[#4B5563] space-y-1">
                <div className="font-semibold text-[#142B45] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#B79661]" />
                  Avis de non-responsabilité professionnelle
                </div>
                <p>
                  Les analyses publiées reflètent l'état de la législation fiscale belge à la date d'émission. Chaque situation requérant un examen personnalisé, nous vous invitons à solliciter une consultation au cabinet.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F7F6F2] border-t border-[#E8E6DF] flex items-center justify-between">
              <div className="text-xs text-[#4B5563]">
                FIDCOGEST SRL • Expert-Comptable &amp; Conseil Fiscal Agréé ITAA
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 bg-[#142B45] hover:bg-[#1D3B5C] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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
