import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

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
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & ITAA Accreditation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-display font-extrabold text-lg">
                F
              </div>
              <span className="text-lg font-display font-bold text-white tracking-tight">
                FIDCOGEST
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Cabinet d'expertise comptable & de conseil fiscal certifié ITAA en Belgique. Accompagnement sur-mesure pour indépendants, dirigeants de SRL et professions libérales.
            </p>

            <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/20 text-xs space-y-1 font-mono">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Agrément Legal ITAA
              </div>
              <div className="text-slate-300">N° d'enregistrement : 10.842.109</div>
              <div className="text-slate-400">BCE / TVA : BE 0842.109.812</div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Navigation &amp; Outils
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">
                  Accueil &amp; Échéances Fiscables
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-amber-400 transition-colors">
                  Le Cabinet &amp; Les Associés ITAA
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber-400 transition-colors">
                  Pôles d'Expertise &amp; Formules
                </Link>
              </li>
              <li>
                <Link to="/outils-simulateurs" className="hover:text-amber-400 transition-colors">
                  Simulateurs Rémunération &amp; Calendrier TVA
                </Link>
              </li>
              <li>
                <Link to="/actualites" className="hover:text-amber-400 transition-colors">
                  Actualités Fiscables &amp; Peppol 2026
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact &amp; Prise de RDV
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional Offices in Belgium */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Nos Implantations
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Cabinet Bruxelles (Siège)
                </div>
                <div className="text-slate-400 mt-1">Avenue Louise 240, 1050 Bruxelles</div>
                <div className="text-amber-400 font-mono mt-0.5">+32 2 555 01 88</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Cabinet Mons / Wallonie
                </div>
                <div className="text-slate-400 mt-1">Boulevard Dolez 12, 7000 Mons</div>
                <div className="text-amber-400 font-mono mt-0.5">+32 65 33 02 11</div>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Actions & Software Links */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Services Clients
            </h4>

            <div className="space-y-2">
              <button
                onClick={onOpenBooking}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                Prendre Rendez-vous en Ligne
              </button>

              <button
                onClick={onOpenVault}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                Espace Client &amp; Dépôt Express
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              <span>Écosystème partenaire : Billit • Exact Online • Yuki • WinBooks • Odoo • Silverfin</span>
            </div>
          </div>

        </div>

        {/* Bottom Hairline & Legal Copyright Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Cabinet Fidcogest. Tous droits réservés. Expert-Comptable &amp; Conseiller Fiscal Certifié ITAA.</p>
          
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={onOpenLegal} className="hover:text-amber-400 transition-colors">
              Mentions Légales &amp; BCE
            </button>
            <span>·</span>
            <button onClick={onOpenLegal} className="hover:text-amber-400 transition-colors">
              Politique de Confidentialité RGPD
            </button>
            <span>·</span>
            <a href="https://www.itaa.be" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              ITAA.be <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
