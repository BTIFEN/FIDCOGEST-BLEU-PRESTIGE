import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Calendar, Lock, Smartphone } from 'lucide-react';
import { useCabinet } from '../context/CabinetContext';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
  onOpenLegal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenVault
}) => {
  const { config } = useCabinet();
  const { cabinet } = config;

  return (
    <footer className="cabinet-footer bg-[#142B45] text-[#E2E8F0] border-t border-[#1D3B5C] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* 4 Colonnes Équilibrées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Colonne 1 : FIDCOGEST */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {config.images?.logoDark && config.images.logoDark !== '/assets/images/logo_fidcogest_dark.svg' ? (
                <img
                  src={config.images.logoDark}
                  alt={cabinet.name}
                  className="h-10 w-auto max-w-[200px] object-contain"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1D3B5C] border border-[#D5B477] flex items-center justify-center text-[#D5B477] font-serif text-lg font-bold shadow-xs">
                    F
                  </div>
                  <span className="font-serif text-xl font-bold text-[#FFFFFF] tracking-wide">
                    FIDCOGEST
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-[#E2E8F0] leading-relaxed">
              Cabinet d'expertise comptable et de conseil fiscal certifié ITAA, fondé en 2008 par Paul Holl Mpeck. Nous accompagnons dirigeants de SRL, indépendants et entrepreneurs avec rigueur et proximité humaine.
            </p>

            <div className="p-3.5 rounded-xl bg-[#102338] border border-[#1D3B5C] text-xs space-y-1.5 shadow-xs">
              <div className="text-[#D5B477] font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D5B477]" />
                <span>Agrément officiel ITAA</span>
              </div>
              <div className="text-[#CBD5E1]">BCE &amp; TVA : <span className="font-mono text-[#FFFFFF] font-bold">{cabinet.vatNumber}</span></div>
              <div className="text-[#CBD5E1]">Peppol B2B : <span className="font-mono text-[#D5B477] font-bold">{cabinet.peppolIdentifier}</span></div>
            </div>
          </div>

          {/* Colonne 2 : Le Cabinet & Services */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-[#FFFFFF] uppercase tracking-wider border-b border-[#1D3B5C] pb-2">
              Le Cabinet
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors flex items-center gap-1">
                  <span>Accueil</span>
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors flex items-center gap-1">
                  <span>Présentation &amp; Valeurs</span>
                </Link>
              </li>
              <li>
                <Link to="/notre-equipe" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors flex items-center gap-1">
                  <span>Notre Équipe (Paul Holl Mpeck)</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors flex items-center gap-1">
                  <span>Nos 7 Domaines d'Expertise</span>
                </Link>
              </li>
              <li>
                <Link to="/creation-entreprise" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors flex items-center gap-1">
                  <span>Création d'Entreprise &amp; SRL</span>
                </Link>
              </li>
              <li>
                <Link to="/fiscalite" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors flex items-center gap-1">
                  <span>Fiscalité &amp; Optimisation</span>
                </Link>
              </li>
              <li>
                <Link to="/e-compta" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors flex items-center gap-1">
                  <span>E-Compta &amp; Dématérialisation</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Liens Utiles & Outils */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-[#FFFFFF] uppercase tracking-wider border-b border-[#1D3B5C] pb-2">
              Outils &amp; Accès
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/outils-simulateurs" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors">
                  Outils &amp; Simulateurs Fiscaux
                </Link>
              </li>
              <li>
                <Link to="/actualites" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors">
                  Actualités &amp; Échéances 2026
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenVault}
                  className="text-[#FFFFFF] hover:text-[#D5B477] transition-colors flex items-center gap-2 cursor-pointer text-left bg-[#102338] hover:bg-[#1A3452] px-3 py-2 rounded-xl border border-[#1D3B5C] w-full"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D5B477] shrink-0" />
                  <span className="font-bold text-xs">Portail Client Sécurisé</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="text-[#FFFFFF] hover:text-[#D5B477] transition-colors flex items-center gap-2 cursor-pointer text-left bg-[#102338] hover:bg-[#1A3452] px-3 py-2 rounded-xl border border-[#1D3B5C] w-full"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D5B477] shrink-0" />
                  <span className="font-bold text-xs">Prendre un rendez-vous</span>
                </button>
              </li>
              <li>
                <Link to="/contact" className="text-[#F1F5F9] hover:text-[#D5B477] transition-colors">
                  Plan d'accès &amp; Itinéraire
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-[#D5B477] hover:underline transition-colors flex items-center gap-1 font-bold">
                  <span>Administration du cabinet</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact & Siège */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-[#FFFFFF] uppercase tracking-wider border-b border-[#1D3B5C] pb-2">
              Contact &amp; Accès
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#102338] border border-[#1D3B5C] space-y-2.5 shadow-xs">
                <div className="font-bold text-[#FFFFFF] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D5B477] shrink-0" />
                  <span>{cabinet.headquarters.address}</span>
                </div>
                <div className="text-[#CBD5E1] pl-6">
                  {cabinet.headquarters.postalCode} {cabinet.headquarters.city}
                </div>
                
                <div className="pt-2 border-t border-[#1D3B5C] space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D5B477] shrink-0" />
                    <a href={`tel:${cabinet.phone.replace(/[^0-9+]/g, '')}`} className="text-[#FFFFFF] hover:text-[#D5B477] font-mono font-bold">
                      {cabinet.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#D5B477] shrink-0" />
                    <a href={`tel:${cabinet.mobile.replace(/[^0-9+]/g, '')}`} className="text-[#D5B477] hover:underline font-mono font-bold">
                      {cabinet.mobile}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D5B477] shrink-0" />
                    <a href={`mailto:${cabinet.email}`} className="text-[#F1F5F9] hover:text-[#FFFFFF] truncate font-bold">
                      {cabinet.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#CBD5E1] bg-[#102338] p-2.5 rounded-xl border border-[#1D3B5C]">
                Permanence : <strong className="text-[#FFFFFF]">{cabinet.openingHours}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Barre Inférieure de Clôture Institutionnelle */}
        <div className="pt-8 border-t border-[#1D3B5C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CBD5E1]">
          <p>© {new Date().getFullYear()} <strong className="text-[#FFFFFF]">{cabinet.name}</strong> · Expert-comptable &amp; Conseil fiscal certifié ITAA.</p>
          
          <div className="flex items-center gap-4 text-[#F1F5F9] flex-wrap font-medium">
            <Link to="/mentions-legales" className="hover:text-[#D5B477] transition-colors">
              Mentions Légales &amp; RGPD
            </Link>
            <span className="text-[#1D3B5C]">·</span>
            <span className="font-mono text-[#FFFFFF] font-bold">BCE BE 0899.441.309</span>
            <span className="text-[#1D3B5C]">·</span>
            <a href="https://www.itaa.be" target="_blank" rel="noopener noreferrer" className="hover:text-[#D5B477] transition-colors flex items-center gap-1">
              <span>ITAA.be</span>
              <ExternalLink className="w-3 h-3 text-[#D5B477]" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
