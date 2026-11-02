import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TAX_DEADLINES_2026, TESTIMONIALS } from '../data/mockData';
import { useCabinet } from '../context/CabinetContext';
import { Calendar, ShieldCheck, ArrowRight, Lock, CheckCircle2, TrendingUp, Calculator, Rocket, PieChart, Star, MessageSquare, FileCheck, MapPin, Building, Smartphone } from 'lucide-react';

interface HomePageProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBooking,
  onOpenVault
}) => {
  const navigate = useNavigate();
  const { config } = useCabinet();
  const { cabinet, services } = config;
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredDeadlines = TAX_DEADLINES_2026.filter((d) => {
    if (filterCategory === 'all') return true;
    return d.category === filterCategory;
  });

  return (
    <div className="space-y-20 pb-16 font-sans">
      
      {/* SECTION 1: HERO VITRINE ÉDITORIALE PREMIUM */}
      <section className="relative pt-10 pb-14 lg:pt-16 lg:pb-24 border-b border-[#E8E6DF] bg-gradient-to-b from-[#FAF9F6] via-[#F7F6F2] to-[#F3F1EC]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Colonne Gauche : Positionnement & Titre Majeur */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge d'accréditation légale ITAA */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-semibold text-[#8C6A34] shadow-[0_2px_8px_rgba(183,150,97,0.08)]">
                <ShieldCheck className="w-4 h-4 text-[#B79661] shrink-0" />
                <span>{cabinet.name} • Cabinet d'Expertise Comptable &amp; Fiscale Certifié ITAA</span>
              </div>

              {/* Titre Principal Noble & Institutionnel */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight leading-[1.18] text-balance">
                L'expertise comptable &amp; fiscale de référence pour <span className="text-[#8C6A34] italic font-serif">dirigeants</span> et indépendants en Belgique.
              </h1>

              {/* Sous-titre rassurant et complet */}
              <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl font-sans">
                Déclarations TVA, bilan annuel BNB, Impôt des Sociétés (ISOC), Impôt des Personnes Physiques (IPP), création de société et plan financier notarié. L'alliance d'une rigueur déontologique absolue, du conseil fiscal proactif et de la proximité humaine à Bruxelles.
              </p>

              {/* Appels à l'action principaux */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-3.5 bg-[#142B45] hover:bg-[#1D3B5C] text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-[#142B45]/15 flex items-center gap-2.5 group cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#D9BD8E]" />
                  <span>Prendre rendez-vous</span>
                  <ArrowRight className="w-4 h-4 text-[#D9BD8E] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={onOpenVault}
                  className="px-5 py-3.5 bg-white hover:bg-[#FAF9F6] text-[#142B45] border border-[#D1D5DB] hover:border-[#B79661] rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#B79661]" />
                  <span>Espace Basecone &amp; Dépôt Express</span>
                </button>

                <a
                  href={`https://wa.me/${cabinet.mobile.replace(/[^0-9]/g, '')}?text=Bonjour%20Fidcogest%2C%20je%20souhaite%20un%20renseignement%20sur%20vos%20services%20comptables.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3.5 bg-[#0E5E3A] hover:bg-[#0B4A2D] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-200" />
                  <span>WhatsApp direct</span>
                </a>
              </div>

              {/* Piliers de confiance & garanties */}
              <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1.5 font-medium text-[#374151]">
                  <CheckCircle2 className="w-4 h-4 text-[#B79661]" /> Honoraires forfaitaires transparents
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#374151]">
                  <CheckCircle2 className="w-4 h-4 text-[#B79661]" /> Solution Basecone &amp; Peppol B2B
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#374151]">
                  <CheckCircle2 className="w-4 h-4 text-[#B79661]" /> Réponse garantie sous 24h ouvrées
                </span>
              </div>

            </div>

            {/* Colonne Droite : Dossier Institutionnel */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-[#E8E6DF] p-6 sm:p-8 shadow-[0_12px_40px_rgba(20,43,69,0.06)] space-y-6">
                
                {/* En-tête du Sceau & Identification */}
                <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#142B45] text-[#D9BD8E] font-serif font-bold text-2xl flex items-center justify-center shadow-md shadow-[#142B45]/15">
                      F
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#142B45]">Fidcogest SRL</h3>
                      <p className="text-xs text-[#6B7280]">{cabinet.headquarters.address}, {cabinet.headquarters.city}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold text-[#8C6A34] bg-[#B79661]/12 border border-[#B79661]/30 rounded-full">
                    Agréé ITAA
                  </span>
                </div>

                {/* 4 Engagements Déontologiques & Qualité */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF]">
                    <ShieldCheck className="w-5 h-5 text-[#B79661] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#142B45]">Secret Professionnel Légal</div>
                      <div className="text-[#6B7280] leading-snug mt-0.5">
                        Soumis à l'article 458 du Code pénal belge et aux normes strictes de déontologie ITAA.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF]">
                    <TrendingUp className="w-5 h-5 text-[#B79661] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#142B45]">Conseil Fiscal Stratégique &amp; Anticipation</div>
                      <div className="text-[#6B7280] leading-snug mt-0.5">
                        Arbitrage Rémunération Dirigeant, dividendes VVPR-bis à 15% et taux réduit ISOC 20%.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF]">
                    <FileCheck className="w-5 h-5 text-[#B79661] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#142B45]">Conformité Rigoureuse BNB &amp; SPF Finances</div>
                      <div className="text-[#6B7280] leading-snug mt-0.5">
                        Dépôts dans les délais prescrits, déclarations TVA sans erreur et absence de majoration.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accès rapide aux simulateurs */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/outils-simulateurs')}
                    className="w-full py-3 px-4 rounded-xl bg-[#F7F6F2] hover:bg-[#EFECE5] border border-[#E8E6DF] text-xs font-semibold text-[#142B45] flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-[#B79661]" />
                      <span>Simulateur Fiscal : Rémunération Dirigeant &amp; SRL vs Indépendant</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#142B45] group-hover:translate-x-1 transition-all" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: CHIFFRES CLÉS & IDENTITÉ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-2xl bg-white border border-[#E8E6DF] shadow-[0_4px_20px_rgba(20,43,69,0.04)] text-center">
          <div className="space-y-1.5">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45]">Depuis 2008</div>
            <div className="text-xs text-[#6B7280] font-medium leading-snug">Création et activité ininterrompue en Belgique</div>
          </div>
          <div className="space-y-1.5 border-l border-[#E8E6DF] pl-6">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45]">20+ Ans</div>
            <div className="text-xs text-[#6B7280] font-medium leading-snug">D'expertise de Paul Holl Mpeck (ITAA)</div>
          </div>
          <div className="space-y-1.5 border-l border-[#E8E6DF] pl-6">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#8C6A34]">7 Pôles</div>
            <div className="text-xs text-[#6B7280] font-medium leading-snug">Comptabilité, Fiscalité, Création, Audit, Financement</div>
          </div>
          <div className="space-y-1.5 border-l border-[#E8E6DF] pl-6">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45]">100% Cloud</div>
            <div className="text-xs text-[#6B7280] font-medium leading-snug">Dématérialisation Basecone &amp; Peppol 2026</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LES 7 PÔLES D'EXPERTISE HISTORIQUES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
            Nos Domaines d'Intervention
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142B45]">
            Les 7 Pôles de Services du Cabinet Fidcogest
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            Une gamme complète de prestations comptables, fiscales et financières adaptées à chaque phase de la vie de votre entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((pole, idx) => (
            <div
              key={pole.id}
              className="p-7 rounded-2xl bg-white border border-[#E8E6DF] hover:border-[#B79661] transition-all flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] text-[#142B45] group-hover:text-[#8C6A34] flex items-center justify-center font-bold text-lg transition-colors">
                    {idx === 0 && <Calculator className="w-5 h-5" />}
                    {idx === 1 && <TrendingUp className="w-5 h-5" />}
                    {idx === 2 && <Rocket className="w-5 h-5" />}
                    {idx === 3 && <PieChart className="w-5 h-5" />}
                    {idx === 4 && <Building className="w-5 h-5" />}
                    {idx === 5 && <CheckCircle2 className="w-5 h-5" />}
                    {idx === 6 && <Smartphone className="w-5 h-5" />}
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-[#9CA3AF] group-hover:text-[#8C6A34] transition-colors">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#142B45] group-hover:text-[#8C6A34] transition-colors">
                    {pole.title}
                  </h3>
                  {pole.tagline && (
                    <p className="text-xs text-[#8C6A34] font-medium mt-0.5 line-clamp-1">{pole.tagline}</p>
                  )}
                </div>

                <p className="text-xs text-[#4B5563] leading-relaxed font-sans line-clamp-3">
                  {pole.description}
                </p>

                {pole.subServices && pole.subServices.length > 0 && (
                  <ul className="space-y-1.5 pt-2 border-t border-[#F0EFEA] text-[11px] text-[#4B5563]">
                    {pole.subServices.slice(0, 3).map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B79661] shrink-0"></span>
                        <span className="truncate">{sub.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs">
                <Link
                  to={
                    pole.id === 'creation-entreprises' ? '/creation-entreprise' :
                    pole.id === 'fiscalite' ? '/fiscalite' :
                    pole.id === 'e-compta' ? '/e-compta' :
                    '/services'
                  }
                  className="font-semibold text-[#142B45] hover:text-[#8C6A34] flex items-center gap-1 group-hover:translate-x-1 transition-all"
                >
                  Découvrir ce pôle →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: ÉCHÉANCIER FISCAL OFFICIEL 2026 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6DF] pb-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
              Veille &amp; Calendrier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
              Calendrier fiscal officiel de la Belgique 2026
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Anticipez vos échéances TVA, ISOC, IPP et dépôts BNB sans aucune pénalité.
            </p>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-xl border border-[#E8E6DF] text-xs shadow-xs">
            {['all', 'TVA', 'ISOC', 'IPP', 'Fiches 281'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-[#142B45] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#142B45] hover:bg-[#F7F6F2]'
                }`}
              >
                {cat === 'all' ? 'Toutes les échéances' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des échéances */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDeadlines.slice(0, 6).map((dl) => (
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
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-[#FAF9F6] text-[#8C6A34] border border-[#E8E6DF]">
                    {dl.category}
                  </span>
                  <span className="text-xs font-semibold text-[#142B45] flex items-center gap-1.5 bg-[#F7F6F2] px-2 py-0.5 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-[#B79661]" /> {dl.dueDate}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-sm text-[#142B45]">{dl.title}</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">{dl.description}</p>
              </div>

              <div className="pt-3 border-t border-[#F0EFEA] flex items-center justify-between text-xs text-[#6B7280]">
                <span>Périodicité : <strong className="text-[#374151]">{dl.period}</strong></span>
                <button
                  onClick={onOpenBooking}
                  className="text-[#142B45] hover:text-[#8C6A34] font-semibold hover:underline cursor-pointer"
                >
                  Confier ce dépôt →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: TÉMOIGNAGES CLIENTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
            Confiance &amp; Proximité
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142B45]">
            La voix de nos dirigeants et indépendants partenaires
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E8E6DF] flex flex-col justify-between space-y-5 text-xs shadow-xs"
            >
              <div className="space-y-3.5">
                <div className="flex items-center gap-1 text-[#B79661]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B79661]" />
                  ))}
                </div>
                <p className="text-[#4B5563] italic leading-relaxed text-[13px] font-serif">
                  « {t.quote} »
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#142B45]">{t.clientName}</div>
                  <div className="text-xs text-[#6B7280]">{t.roleCompany}</div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#FAF9F6] text-[#8C6A34] rounded-md border border-[#E8E6DF]">
                  {t.companyType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: BANNIÈRE PRE-FOOTER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#142B45] text-white border border-[#1D3B5C] shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3.5 max-w-2xl text-left">
            <span className="px-3.5 py-1 text-xs font-semibold text-[#D9BD8E] bg-[#1D3B5C] border border-[#B79661]/40 rounded-full inline-block">
              Premier entretien d'orientation offert
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug">
              Prêt à optimiser la gestion fiscale de votre entreprise en Belgique ?
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              Planifiez une consultation avec Paul Holl Mpeck ou un conseiller fiscal certifié ITAA du cabinet Fidcogest à Ganshoren.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3.5 bg-white hover:bg-[#F7F6F2] text-[#142B45] font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#B79661]" />
              <span>Prendre rendez-vous</span>
            </button>

            <button
              onClick={onOpenVault}
              className="px-5 py-3.5 bg-[#1D3B5C] hover:bg-[#254A73] text-white border border-[#3A5B80] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#D9BD8E]" />
              <span>Espace Client Basecone</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
