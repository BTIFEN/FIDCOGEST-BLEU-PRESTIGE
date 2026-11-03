import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { ShieldCheck, Award, Mail, MapPin, CheckCircle2, UserCheck, Calendar, ArrowRight, Building } from 'lucide-react';
import { Button, Card } from '../components/ui';

interface TeamPageProps {
  onOpenBooking: () => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onOpenBooking }) => {
  const { config } = useCabinet();
  const { team, cabinet } = config;

  const founder = team.find(m => m.id === 'paul-holl-mpeck') || team[0];
  const collaborators = team.filter(m => m.id !== 'paul-holl-mpeck');

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Editorial Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <UserCheck className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">Agrément &amp; Déontologie ITAA • Depuis 2008</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            Notre Équipe &amp; Direction du Cabinet
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Une structure à taille humaine, guidée par l'exigence professionnelle, le respect du secret de fonction et la proximité constante avec chaque entrepreneur.
          </p>
        </div>
      </section>

      {/* Main Founder Showcase Card */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Card variant="standard" padding="lg" className="border-[#B79661]/40 bg-gradient-to-br from-white via-white to-[#F7F6F2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Portrait & Crest */}
            <div className="lg:col-span-4 text-center space-y-4">
              <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-2xl overflow-hidden border-2 border-[#B79661] shadow-xl bg-[#142B45] group">
                <img
                  src={config.images?.portraitPaulHollMpeck || '/assets/images/portrait_paul_holl_mpeck.svg'}
                  alt="Paul Holl Mpeck - Gérant Fondateur FIDCOGEST SRL ITAA"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/portrait_paul_holl_mpeck.svg';
                  }}
                />
              </div>

              <div className="space-y-1">
                <span className="cabinet-badge-itaa">
                  Expert-comptable &amp; Conseil fiscal
                </span>
                <div className="text-xs text-[#6B7280] font-sans flex items-center justify-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B79661]" />
                  <span>{cabinet.headquarters.city}</span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <span className="text-xs font-serif text-[#B79661] font-bold tracking-wider uppercase block">
                  Direction Générale &amp; Fondateur
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#142B45] mt-1">
                  {founder.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#B79661] font-semibold mt-0.5">
                  {founder.role}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
                {founder.bio}
              </p>

              {/* Specialties */}
              <div className="space-y-2 pt-2 border-t border-[#E8E6DF]">
                <span className="text-xs font-semibold text-[#142B45] uppercase tracking-wider block">
                  Domaines d'intervention privilégiés :
                </span>
                <div className="flex flex-wrap gap-2">
                  {founder.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] text-xs text-[#142B45] font-medium flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenBooking}
                  icon={<Calendar className="w-4 h-4 text-white" />}
                >
                  Prendre rendez-vous avec le cabinet
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  to={`mailto:${founder.email}`}
                  external
                  icon={<Mail className="w-4 h-4 text-[#B79661]" />}
                >
                  Contacter la direction
                </Button>
              </div>
            </div>

          </div>
        </Card>
      </section>

      {/* Collaborating Teams Grid */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="font-serif font-bold text-2xl text-[#142B45]">
            Les Pôles Opérationnels du Cabinet
          </h3>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Une organisation structurée garantissant le traitement rapide de vos pièces comptables et le suivi ponctuel de vos échéances fiscales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collaborators.map((collab) => (
            <div key={collab.id} className="cabinet-card p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#142B45] text-[#B79661] flex items-center justify-center font-serif font-bold shadow-xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="cabinet-badge-neutral text-xs">
                    {collab.accreditation || 'Équipe Fidcogest'}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-lg text-[#142B45]">
                  {collab.name}
                </h4>

                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                  {collab.bio}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-[#142B45] uppercase tracking-wider block">
                    Missions clés :
                  </span>
                  <ul className="space-y-1 text-xs text-[#4B5563]">
                    {collab.specialties.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B79661]"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E6DF] flex items-center justify-between text-xs">
                <span className="text-[#6B7280] font-mono">{collab.location}</span>
                <a
                  href={`mailto:${collab.email}`}
                  className="font-semibold text-[#142B45] hover:text-[#B79661] transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5 text-[#B79661]" />
                  Écrire au pôle
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code of Ethics & ITAA Commitment */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl p-8 bg-gradient-to-br from-[#163354] to-[#0F2238] text-white border-2 border-[#2B4E77] space-y-6 shadow-xl">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-serif text-[#F3D085] uppercase tracking-widest font-bold block">
              Garantie Professionnelle &amp; Déontologie
            </span>
            <h3 className="font-serif font-bold text-2xl text-white">
              Le Secret Professionnel et l'Indépendance au Cœur de Notre Engagement
            </h3>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              En tant que membres assermentés de l'Institute for Tax Advisors and Accountants (ITAA), l'ensemble de nos interventions est encadré par les normes de déontologie légale les plus strictes de Belgique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 space-y-1">
              <div className="font-serif font-bold text-sm text-[#F3D085]">Article 458 CP</div>
              <div className="text-xs text-slate-100 font-medium">Secret professionnel absolu couvrant l'ensemble des données confidentielles de nos clients.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 space-y-1">
              <div className="font-serif font-bold text-sm text-[#F3D085]">Formation Continue</div>
              <div className="text-xs text-slate-100 font-medium">Actualisation obligatoire de plus de 40 heures par an pour maîtriser l'évolution fiscale belge.</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 space-y-1">
              <div className="font-serif font-bold text-sm text-[#F3D085]">Assurance Professionnelle</div>
              <div className="text-xs text-slate-100 font-medium">Responsabilité civile professionnelle certifiée couvrant chaque acte et déclaration posé par le cabinet.</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
