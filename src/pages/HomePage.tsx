import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TAX_DEADLINES_2026, SERVICE_POLES, TESTIMONIALS } from '../data/mockData';
import { Calendar, ShieldCheck, ArrowRight, Lock, CheckCircle2, TrendingUp, Calculator, Rocket, PieChart, Star, AlertTriangle, MessageSquare } from 'lucide-react';

interface HomePageProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBooking,
  onOpenVault
}) => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredDeadlines = TAX_DEADLINES_2026.filter((d) => {
    if (filterCategory === 'all') return true;
    return d.category === filterCategory;
  });

  return (
    <div className="fid-home space-y-16 pb-12 font-sans">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="fid-hero relative pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
        {/* Subtle background grid and radial gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* ITAA Accreditation Kicker */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cabinet d'Expertise Comptable &amp; Fiscale Certifié ITAA n° 10.842.109</span>
              </div>

              {/* Main Headline with balanced wrap */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-[1.15] text-balance">
                L'expertise comptable &amp; fiscale de <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">confiance</span> pour dirigeants et indépendants en Belgique.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans max-w-2xl">
                TVA, bilan annuel BNB, Impôt des Sociétés (ISOC), Impôt des Personnes Physiques (IPP) et plan financier de création. Alliance de la réactivité numérique et du contact humain de proximité à Bruxelles et en Wallonie.
              </p>

              {/* Action Buttons CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-display font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 group"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Prendre rendez-vous</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenVault}
                  className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/90 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-md"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Déposer vos documents (Express)</span>
                </button>

                <a
                  href="https://wa.me/3225550188?text=Bonjour%20Fidcogest%2C%20je%20souhaite%20un%20renseignement%20sur%20vos%20services%20comptables."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 rounded-xl text-xs font-mono transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp direct</span>
                </a>
              </div>

              {/* Key Trust Badges inline */}
              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Honoraires forfaitaires clairs
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Facturation Peppol 2026 prête
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Réponse garantie &lt; 24h
                </span>
              </div>

            </div>

            {/* Right Column: Key Interactive Quick Card & ITAA Seal Container */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-display font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                      F
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Cabinet Fidcogest ITAA</h3>
                      <p className="text-xs text-slate-400 font-mono">Bruxelles Louise • Mons Wallonie</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-800 rounded-full">
                    Actif en Belgique
                  </span>
                </div>

                {/* Quick Fiscal Deadlines Teaser Box */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Prochaine Échéance Fiscale Belge
                    </span>
                    <span className="text-slate-400">Consultez le calendrier</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-white">Déclaration TVA &amp; 1er Versement Anticipé ISOC (VA1)</h4>
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-500 text-slate-950 font-bold rounded">
                        À vérifier
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug font-sans">
                      Dépôt TVA T1 et paiement du versement anticipé ISOC VA1 pour bénéficier de la bonification fiscale d'impôt.
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 flex justify-between border-t border-slate-800/80">
                      <span>Date limite : 20 Consultez le calendrier</span>
                      <button onClick={() => navigate('/outils-simulateurs')} className="text-amber-400 hover:underline">
                        Voir le calendrier complet →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Link to Tax Calculator */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/outils-simulateurs')}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-amber-400" />
                      <span>Simulateur Rémunération Dirigeant &amp; SRL vs Indépendant</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: QUANTITATIVE PROOF BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 text-center font-mono">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">18+ Ans</div>
            <div className="text-xs text-slate-400">D'expertise comptable &amp; conseil fiscal ITAA</div>
          </div>
          <div className="space-y-1 border-l border-slate-800 pl-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">450+</div>
            <div className="text-xs text-slate-400">Sociétés (SRL/SA) &amp; Indépendants accompagnés</div>
          </div>
          <div className="space-y-1 border-l border-slate-800 pl-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">99.4%</div>
            <div className="text-xs text-slate-400">Conformité fiscale &amp; validations TVA sans pénalité</div>
          </div>
          <div className="space-y-1 border-l border-slate-800 pl-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-display">&lt; 24h</div>
            <div className="text-xs text-slate-400">Délai moyen de réponse de votre conseiller dédié</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LES 4 PÔLES D'EXPERTISE (BENTO GRID) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-mono uppercase text-amber-400 tracking-widest">
            01. Pôles de Services Spécialisés
          </h2>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Un accompagnement comptable et fiscal à 360° en Belgique
          </h3>
          <p className="text-sm text-slate-400">
            De la tenue quotidienne de vos comptes à l'optimisation légale de vos revenus de dirigeant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICE_POLES.map((pole, idx) => (
            <div
              key={pole.id}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl">
                    {idx === 0 && <Calculator className="w-6 h-6" />}
                    {idx === 1 && <TrendingUp className="w-6 h-6" />}
                    {idx === 2 && <Rocket className="w-6 h-6" />}
                    {idx === 3 && <PieChart className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-amber-400 transition-colors">
                    0{idx + 1} / POLE
                  </span>
                </div>

                <div>
                  <h4 className="text-xl font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                    {pole.title}
                  </h4>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">{pole.subtitle}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {pole.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  {pole.keyFeatures.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Public : {pole.suitedFor}</span>
                <button
                  onClick={() => navigate('/services')}
                  className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-all"
                >
                  Détail de l'offre →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FLUX DES ÉCHÉANCES FISCALES BELGES (CALENDRIER INTERACTIF) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xs font-mono uppercase text-amber-400 tracking-widest">
              02. Échéances Fiscables &amp; Légales
            </h2>
            <h3 className="text-2xl font-display font-bold text-white">
              Calendrier fiscal officiel de la Belgique 2026
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ne manquez plus aucune échéance TVA, ISOC, IPP ou envoi de fiches 281.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
            {['all', 'TVA', 'ISOC', 'IPP', 'Fiches 281'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Toutes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Deadlines List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeadlines.slice(0, 6).map((dl) => (
            <div
              key={dl.id}
              className={`p-4 rounded-xl bg-slate-900 border transition-all flex flex-col justify-between space-y-3 ${
                dl.isUrgent
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
                    {dl.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {dl.dueDate}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{dl.title}</h4>
                <p className="text-xs text-slate-400 leading-snug">{dl.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Périodicité: {dl.period}</span>
                <button
                  onClick={onOpenBooking}
                  className="text-amber-400 hover:underline font-medium"
                >
                  Rappel expert →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/outils-simulateurs')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors inline-flex items-center gap-2"
          >
            <span>Consulter le calendrier fiscal interactif complet</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* SECTION 5: TÉMOIGNAGES CLIENTS ATTRUBUABLES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-mono uppercase text-amber-400 tracking-widest">
            03. Témoignages &amp; Confiance
          </h2>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Ce que disent nos dirigeants de sociétés et indépendants
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 text-xs font-sans"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 italic leading-relaxed font-sans">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{t.clientName}</div>
                  <div className="text-[11px] text-slate-400">{t.roleCompany}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-amber-400 rounded">
                  {t.companyType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: CALL TO ACTION BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/40 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="px-3 py-1 text-xs font-mono text-amber-300 bg-amber-950 border border-amber-800 rounded-full inline-block">
              Premier rendez-vous d'analyse offert
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Prêt à optimiser la gestion fiscale de votre entreprise en Belgique ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Planifiez une consultation de 30 minutes avec l'un de nos experts-comptables certifiés ITAA. Analyse personnalisée de votre structure et proposition forfaitaire sans engagement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-display font-extrabold text-xs rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Prendre RDV maintenant
            </button>

            <button
              onClick={onOpenVault}
              className="px-5 py-3.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              Transmettre mes pièces
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
