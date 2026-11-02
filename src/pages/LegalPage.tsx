import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { ShieldCheck, Lock, FileText, Building, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { config } = useCabinet();
  const { cabinet } = config;

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">Cadre Légal &amp; Déontologique • Belgique</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            Mentions Légales &amp; Politique de Confidentialité
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Transparence statutaire, protection absolue des données personnelles (RGPD) et respect du secret professionnel ITAA.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="cabinet-card p-8 sm:p-12 space-y-8 text-sm text-[#4B5563] leading-relaxed">
          
          {/* Section 1: Identification */}
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#142B45] flex items-center gap-2 border-b border-[#E8E6DF] pb-2">
              <Building className="w-5 h-5 text-[#B79661]" />
              1. Identification de l'Éditeur &amp; Statut Légal
            </h2>
            <p>
              Le site internet <code className="text-[#142B45] font-semibold">https://www.fidcogest.be</code> est édité par la société <strong>{cabinet.name}</strong>, société à responsabilité limitée de droit belge, active depuis le {cabinet.foundingDate}.
            </p>

            <div className="p-5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-2 font-mono text-xs text-[#374151]">
              <div><strong>Dénomination :</strong> {cabinet.name}</div>
              <div><strong>Forme juridique :</strong> {cabinet.legalForm}</div>
              <div><strong>Siège social :</strong> {cabinet.headquarters.address}, {cabinet.headquarters.postalCode} {cabinet.headquarters.city}, {cabinet.headquarters.country}</div>
              <div><strong>Numéro d'entreprise (BCE) :</strong> {cabinet.bceNumber}</div>
              <div><strong>Numéro de TVA :</strong> {cabinet.vatNumber}</div>
              <div><strong>Identifiant Peppol B2B :</strong> {cabinet.peppolIdentifier}</div>
              <div><strong>Téléphone :</strong> {cabinet.phone} | <strong>Mobile :</strong> {cabinet.mobile}</div>
              <div><strong>Courriel de direction :</strong> {cabinet.email}</div>
            </div>
          </div>

          {/* Section 2: Agrément ITAA */}
          <div className="space-y-3 pt-4 border-t border-[#E8E6DF]">
            <h2 className="font-serif font-bold text-xl text-[#142B45] flex items-center gap-2 border-b border-[#E8E6DF] pb-2">
              <ShieldCheck className="w-5 h-5 text-[#B79661]" />
              2. Agrément Professionnel &amp; Déontologie ITAA
            </h2>
            <p>
              {cabinet.name} est un cabinet d'expertise comptable et de conseil fiscal certifié sous le contrôle de l'<strong>ITAA (Institute for Tax Advisors and Accountants)</strong>, institut légal institué par la loi du 17 mars 2019.
            </p>
            <p>
              À ce titre, les professionnels du cabinet sont tenus au respect le plus strict du <strong>secret professionnel</strong> prévu par l'article 458 du Code pénal belge. Toutes les informations, pièces comptables et données financières transmises au cabinet sont couvertes par cette obligation légale absolue.
            </p>
          </div>

          {/* Section 3: RGPD */}
          <div className="space-y-3 pt-4 border-t border-[#E8E6DF]">
            <h2 className="font-serif font-bold text-xl text-[#142B45] flex items-center gap-2 border-b border-[#E8E6DF] pb-2">
              <Lock className="w-5 h-5 text-[#B79661]" />
              3. Protection des Données Personnelles (RGPD)
            </h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (UE 2016/679) et à la loi belge du 30 juillet 2018 relative à la protection des personnes physiques à l'égard des traitements de données à caractère personnel :
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-[#374151]">
              <li><strong>Finalité du traitement :</strong> Les données collectées (formulaires de contact, prise de rendez-vous, dépôt de documents) sont réservées à la gestion des relations précontractuelles et contractuelles avec nos clients.</li>
              <li><strong>Conservation :</strong> Les données comptables et fiscales sont conservées pendant les délais légaux impératifs (notamment 10 ans selon le Code de droit économique et le Code TVA).</li>
              <li><strong>Sécurité :</strong> Les échanges s'effectuent sous protocole sécurisé SSL/TLS avec un hébergement exclusif au sein de l'Union Européenne.</li>
              <li><strong>Droits d'accès :</strong> Vous bénéficiez d'un droit d'accès, de rectification et d'effacement de vos données personnelles en adressant un email à <code className="text-[#142B45]">{cabinet.email}</code>.</li>
            </ul>
          </div>

          {/* Section 4: Avertissement Simulateurs */}
          <div className="space-y-3 pt-4 border-t border-[#E8E6DF]">
            <h2 className="font-serif font-bold text-xl text-[#142B45] flex items-center gap-2 border-b border-[#E8E6DF] pb-2">
              <FileText className="w-5 h-5 text-[#B79661]" />
              4. Avertissement concernant les Simulateurs
            </h2>
            <p>
              Les simulateurs de calcul (Rémunération Dirigeant SRL, Versements Anticipés ISOC, TVA) mis à disposition sur ce site constituent des instruments pédagogiques et d'estimation. Ils ne sauraient en aucun cas se substituer à une consultation formelle et une analyse écrite délivrée par un expert-comptable ou un conseil fiscal certifié ITAA.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
