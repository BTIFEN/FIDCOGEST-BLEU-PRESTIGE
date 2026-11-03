import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { ShieldCheck, Mail, MapPin, HeartHandshake, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { Button, Card } from '../components/ui';

interface AboutPageProps {
  onOpenBooking: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking }) => {
  const { config } = useCabinet();
  const { cabinet, team, presentationCabinet } = config;

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-10 px-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-semibold text-[#8C6A34] shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#B79661]" />
          <span>Cabinet Agréé ITAA • {cabinet.name}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
          À Propos du Cabinet Fidcogest
        </h1>
        <p className="text-base text-[#4B5563] leading-relaxed">
          {presentationCabinet.subtitle || "L'alliance de la rigueur réglementaire belge, de la vision stratégique d'affaires et de la technologie de gestion numérique."}
        </p>
      </section>

      {/* Philosophy & History */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <Card variant="standard" padding="lg" className="lg:col-span-6 space-y-5">
            {/* Siège social et bureau de proximité Ganshoren */}
            <div className="rounded-xl overflow-hidden border border-[#E8E6DF] shadow-xs bg-[#FAF9F6]">
              <img
                src={config.images?.cabinetGanshoren || '/assets/images/cabinet_ganshoren_modeste.webp'}
                alt="Bureau et espace d'accueil FIDCOGEST SRL Ganshoren Bruxelles"
                loading="lazy"
                className="w-full h-48 sm:h-52 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/cabinet_ganshoren_modeste.jpg';
                }}
              />
            </div>

            <span className="text-xs font-semibold text-[#8C6A34] uppercase tracking-widest">
              Notre Histoire &amp; Notre Ancrage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] leading-snug">
              Un partenaire de confiance à l'écoute de chaque dirigeant depuis {cabinet.foundingYear}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Fondé à Bruxelles (Ganshoren) par <strong>Paul Holl Mpeck</strong>, expert-comptable et conseil fiscal certifié ITAA, le cabinet <strong>{cabinet.name}</strong> s'est imposé comme un acteur rigoureux et disponible pour les indépendants, les PME, les professions libérales et les groupes d'entreprises.
            </p>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Nous cultivons quatre valeurs cardinales : <strong>proximité</strong>, <strong>compétence</strong>, <strong>rigueur</strong> et <strong>assistance continue</strong>. Nous veillons à ce que votre comptabilité soit un outil de prise de décision stratégique et de sérénité face à l'administration fiscale.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="sm"
                to="/notre-equipe"
                icon={<ArrowRight className="w-3.5 h-3.5 text-[#D9BD8E]" />}
                iconPosition="right"
              >
                Découvrir l'équipe &amp; Paul Holl Mpeck
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenBooking}
              >
                Prendre rendez-vous
              </Button>
            </div>
          </Card>

          {/* Core Values Triad from cabinet config */}
          <div className="lg:col-span-6 space-y-4">
            {presentationCabinet.piliers?.map((pilier, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] text-[#8C6A34] flex items-center justify-center shrink-0">
                  {i === 0 ? <HeartHandshake className="w-5 h-5" /> : i === 1 ? <ShieldCheck className="w-5 h-5" /> : i === 2 ? <Zap className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-[#142B45]">{pilier.titre}</h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] leading-relaxed">
                    {pilier.texte}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Team Showcase Brief with Direct Link */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#8C6A34] uppercase tracking-widest">
            Collège Professionnel
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
            Direction et Experts du Cabinet
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Une structure humaine, certifiée et accessible à Ganshoren (Bruxelles).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {team.map((member) => (
            <div
              key={member.id}
              className="p-7 rounded-2xl bg-white border border-[#E8E6DF] hover:border-[#B79661] transition-all flex flex-col justify-between space-y-6 shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#142B45] text-[#D9BD8E] font-serif font-bold text-xl flex items-center justify-center shadow-xs">
                    {member.name.charAt(0)}
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold text-[#8C6A34] bg-[#B79661]/12 border border-[#B79661]/30 rounded-full">
                    {member.accreditation || 'ITAA'}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-[#142B45]">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#8C6A34] mt-0.5">{member.role}</p>
                  <p className="text-xs text-[#6B7280] flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B79661]" /> {member.location}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  {member.bio}
                </p>

                <div className="space-y-2 pt-3 border-t border-[#F0EFEA]">
                  <span className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider block">Spécialisations :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded-md bg-[#FAF9F6] text-[#374151] text-xs border border-[#E8E6DF]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F0EFEA] flex items-center justify-between">
                <a
                  href={`mailto:${member.email}`}
                  className="text-xs text-[#6B7280] hover:text-[#142B45] flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#B79661]" />
                  <span className="truncate">{member.email}</span>
                </a>

                <button
                  onClick={onOpenBooking}
                  className="px-3 py-1.5 bg-[#142B45] hover:bg-[#1D3B5C] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Prendre RDV
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
