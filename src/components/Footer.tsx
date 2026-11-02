import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Calendar, Lock, Smartphone } from 'lucide-react';
import { useCabinet } from '../context/CabinetContext';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
  onOpenLegal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenVault,
  onOpenLegal
}) => {
  const { config } = useCabinet();
  const { cabinet } = config;

  return (
    <footer className="bg-[#142B45] text-[#94A3B8] border-t border-[#1D3B5C] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Official Registration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1D3B5C] border border-[#B79661]/40 flex items-center justify-center text-[#D9BD8E] font-serif text-xl font-bold shadow-md">
                F
              </div>
              <div>
                <span className="font-cinzel text-lg font-bold text-white tracking-wider block">
                  FIDCOGEST SRL
                </span>
                <span className="text-[11px] text-[#D9BD8E] font-medium tracking-wide">
                  Cabinet Agréé ITAA • Depuis {cabinet.foundingYear}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Cabinet d'expertise comptable et de conseil fiscal certifié ITAA. Accompagnement rigoureux et de proximité pour indépendants, dirigeants de SRL, PME et créateurs d'entreprises en Belgique.
            </p>

            <div className="p-3.5 rounded-xl bg-[#1D3B5C]/70 border border-[#2E4D70] text-xs space-y-1">
              <div className="text-[#D9BD8E] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B79661]" />
                Agrément &amp; Immatriculation Officielle
              </div>
              <div className="text-slate-300">BCE / Numéro TVA : <span className="font-mono text-white">{cabinet.vatNumber}</span></div>
              <div className="text-slate-400">Identifiant Peppol B2B : <span className="font-mono text-[#D9BD8E]">{cabinet.peppolIdentifier}</span></div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Navigation &amp; Pôles
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  Accueil &amp; Calendrier Fiscal
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  Le Cabinet &amp; Nos Valeurs
                </Link>
              </li>
              <li>
                <Link to="/notre-equipe" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  Notre Équipe &amp; Paul Holl Mpeck
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  Les 7 Pôles d'Expertise
                </Link>
              </li>
              <li>
                <Link to="/creation-entreprise" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  Création d'Entreprise &amp; SRL
                </Link>
              </li>
              <li>
                <Link to="/fiscalite" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  Fiscalité ISOC, IPP &amp; Contrôles
                </Link>
              </li>
              <li>
                <Link to="/e-compta" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  E-Compta, E-Documents &amp; Basecone
                </Link>
              </li>
              <li>
                <Link to="/outils-simulateurs" className="text-[#CBD5E1] hover:text-[#D9BD8E] transition-colors">
                  Simulateurs Rémunération &amp; TVA
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Coordinates & Official Headquarters */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Siège Social &amp; Contact
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#1D3B5C]/60 border border-[#2E4D70] space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B79661]" />
                  <span>{cabinet.headquarters.city}</span>
                </div>
                <div className="text-slate-300">{cabinet.headquarters.address}</div>
                <div className="text-slate-400">{cabinet.headquarters.postalCode} {cabinet.headquarters.city}</div>
                
                <div className="pt-2 border-t border-[#2E4D70] space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#B79661]" />
                    <a href={`tel:${cabinet.phone.replace(/[^0-9+]/g, '')}`} className="text-white hover:underline font-mono">
                      {cabinet.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#B79661]" />
                    <a href={`tel:${cabinet.mobile.replace(/[^0-9+]/g, '')}`} className="text-[#D9BD8E] hover:underline font-mono">
                      {cabinet.mobile}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#B79661]" />
                    <a href={`mailto:${cabinet.email}`} className="text-slate-300 hover:text-white">
                      {cabinet.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Permanence : {cabinet.openingHours}
              </div>
            </div>
          </div>

          {/* Column 4: Client Services & Basecone */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Espace Client &amp; Outils
            </h4>

            <div className="space-y-2.5">
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 px-3 bg-[#B79661] hover:bg-[#A38148] text-[#142B45] font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#142B45]" />
                <span>Prendre Rendez-vous en Ligne</span>
              </button>

              <button
                onClick={onOpenVault}
                className="w-full py-2.5 px-3 bg-[#1D3B5C] hover:bg-[#254A73] text-white border border-[#3A5B80] rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#D9BD8E]" />
                <span>Espace Basecone &amp; Dépôt Express</span>
              </button>
            </div>

            <div className="pt-2 text-[11px] text-[#94A3B8] leading-relaxed">
              <span className="text-[#D9BD8E] font-semibold block mb-0.5">Solution digitale officielle :</span>
              <span>Basecone (Wolters Kluwer) • Plateforme Peppol • Sécurité SSL bancaire</span>
            </div>
          </div>

        </div>

        {/* Bottom Hairline & Legal Copyright Bar */}
        <div className="pt-8 border-t border-[#1D3B5C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} {cabinet.name}. Tous droits réservés. Expert-comptable &amp; Conseil fiscal certifié ITAA.</p>
          
          <div className="flex items-center gap-4 text-[#94A3B8] flex-wrap">
            <Link to="/mentions-legales" className="hover:text-[#D9BD8E] transition-colors">
              Mentions Légales &amp; BCE
            </Link>
            <span>·</span>
            <Link to="/mentions-legales" className="hover:text-[#D9BD8E] transition-colors">
              Déontologie &amp; RGPD
            </Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-[#D9BD8E] transition-colors text-[#B79661] font-semibold">
              🔒 Administration
            </Link>
            <span>·</span>
            <a href="https://www.itaa.be" target="_blank" rel="noopener noreferrer" className="hover:text-[#D9BD8E] transition-colors flex items-center gap-1">
              ITAA.be <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
