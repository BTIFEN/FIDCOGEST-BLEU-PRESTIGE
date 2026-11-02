import React, { useState } from 'react';
import { NEWS_ARTICLES } from '../data/mockData';
import { NewsArticle } from '../types';
import { FileText, Calendar, User, Clock, ArrowRight, X, ShieldCheck, Tag } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Facturation Électronique', 'Fiscalité', 'Création d\'entreprise'];

  const filteredArticles = NEWS_ARTICLES.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="space-y-12 pb-12 font-sans">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300">
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Analyses Légalement Grounded • Belgique</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Actualités &amp; Analyses Fiscales Belges
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Décryptage de la législation fiscale, réforme des impôts et conseils pratiques rédigés par nos experts-comptables certifiés ITAA.
        </p>
      </section>

      {/* Category Filter Chips */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tous les articles' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {art.readTime}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {art.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{art.date}</span>
                <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Lire l'analyse →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-100 my-8">
            <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="px-3 py-1 text-xs font-mono bg-amber-950 text-amber-300 border border-amber-800 rounded-full">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-4 max-h-[500px] overflow-y-auto leading-relaxed text-xs sm:text-sm font-sans">
              <h2 className="text-2xl font-display font-bold text-white">{selectedArticle.title}</h2>
              <div className="flex items-center gap-4 text-xs font-mono text-amber-400 pt-1 pb-3 border-b border-slate-800">
                <span>Auteur : {selectedArticle.author}</span>
                <span>•</span>
                <span>Publié le : {selectedArticle.date}</span>
              </div>

              <div className="text-slate-200 whitespace-pre-line leading-relaxed space-y-3">
                {selectedArticle.content}
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
