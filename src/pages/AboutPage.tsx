import React from 'react';
import { TEAM_MEMBERS } from '../data/mockData';
import { ShieldCheck, Mail, MapPin, HeartHandshake, Zap, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking }) => {
  return (
    <div className="space-y-16 pb-12 font-sans">
      
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Cabinet Agréé ITAA n° 10.842.109</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          À Propos du Cabinet Fidcogest
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-sans">
          L'alliance de la rigueur réglementaire belge, de la vision stratégique des affaires et de la technologie numérique de pointe.
        </p>
      </section>

      {/* Philosophy & History */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h2 className="text-xs font-mono text-amber-400 uppercase tracking-widest">
              Notre Philosophie &amp; Notre Histoire
            </h2>
            <h3 className="text-2xl font-display font-bold text-white">
              Un partenaire fiscal de proximité à l'écoute de chaque dirigeant
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Fondé à Bruxelles avec une implantation forte en Région Wallonne (Mons), le cabinet <strong>Fidcogest</strong> s'est imposé comme un acteur de référence dans l'accompagnement des indépendants, PME et créateurs d'entreprise.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Nous croyons fermement que la comptabilité ne doit pas se limiter à une obligation administrative stérile, mais constituer un véritable tableau de bord de pilotage pour la croissance et l'optimisation patrimoniale.
            </p>
          </div>

          {/* Core Values Triad */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Transparence des Honoraires</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Forfaits annuels clairs et mensualisés, sans supplément masqué ni facturation à la minute d'appel.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Réactivité &amp; Disponibilité</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Engagements de réponse en moins de 24 heures ouvrées et canal WhatsApp direct avec votre gestionnaire dédié.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Alliance Digital &amp; Contact Humain</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Outils de numérisation OCR et Peppol 2026 couplés à des entretiens périodiques de bilan stratégique de visu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & ITAA Associates Profiles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-mono uppercase text-amber-400 tracking-widest">
            Les Experts du Cabinet
          </h2>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Nos Associés &amp; Conseillers Fiscaux Certifiés ITAA
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-display font-extrabold text-xl flex items-center justify-center shadow-md">
                    {member.name.charAt(0)}
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-mono text-amber-300 bg-amber-950 border border-amber-800 rounded">
                    {member.itaaNumber}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-lg text-white">{member.name}</h4>
                  <p className="text-xs font-mono text-amber-400 mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                    <MapPin className="w-3 h-3 text-slate-500" /> Implantation : {member.location}
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {member.bio}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Domaines d'expertise :</span>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`mailto:${member.email}`}
                  className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{member.email}</span>
                </a>

                <button
                  onClick={onOpenBooking}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  Rendez-vous
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
