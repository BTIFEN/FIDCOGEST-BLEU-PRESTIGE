import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, KeyRound, FolderCog, Users, ClipboardCheck, ArrowRight } from 'lucide-react';

const ownerSteps = [
  { icon: KeyRound, title: 'Son compte et sa sécurité', detail: 'Le propriétaire choisit son adresse, son mot de passe, son Authenticator et conserve ses codes de récupération.' },
  { icon: FolderCog, title: 'Son organisation documentaire', detail: 'Il choisit le stockage privé Hostinger ou son Google Drive, puis les destinations par défaut et par entreprise dans les réglages existants.' },
  { icon: Users, title: 'Son équipe et les accès clients', detail: 'Il définit les gestionnaires, les collaborateurs, les entreprises et leurs autorisations, selon le fonctionnement du cabinet.' },
  { icon: ClipboardCheck, title: 'La mise en service du portail', detail: 'La connexion, les droits d’accès, les échanges de documents, les sauvegardes et la restauration doivent être vérifiés avant les vrais dossiers clients.' }
];

export const OwnerSetupNotice: React.FC<{ detailed?: boolean }> = ({ detailed = false }) => (
  <section aria-label="Mode développement et configuration du propriétaire" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-6 text-[#142B45]">
    <div className="flex items-start gap-3">
      <Construction className="h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-800">Mode développement</p>
        <h2 className="font-serif text-lg font-bold">Configuration finale réservée au propriétaire du cabinet</h2>
        <p className="text-sm leading-relaxed">Le développeur prépare le site et ses fonctionnalités. Le comptable propriétaire finalisera lui-même ses identifiants, sa double authentification, son stockage et les accès de son équipe, selon son organisation.</p>
        <p className="text-xs leading-relaxed text-amber-900">La mise en service du portail client reste à valider. Aucune installation sur un ordinateur n’est nécessaire pour cette configuration.</p>
      </div>
    </div>
    {detailed && (
      <div className="mt-6 space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {ownerSteps.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-xl border border-amber-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2"><Icon className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" /><h3 className="text-sm font-bold">{title}</h3></div>
              <p className="text-xs leading-relaxed text-[#4B5563]">{detail}</p>
              <p className="mt-3 text-xs font-semibold text-amber-800">À configurer ou à valider par le propriétaire</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-white p-4 text-sm leading-relaxed">
          <p className="font-semibold">Transmission au comptable</p>
          <p className="mt-1 text-[#4B5563]">Les réglages personnels peuvent être laissés en attente pendant le développement. Le titulaire final réalise la préparation de son compte dans son navigateur ; la création est ensuite confirmée via le dépôt privé sur l’hébergement. Les réglages documentaires deviennent accessibles après sa connexion au portail.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/preparer-administrateur" className="cabinet-btn-primary text-xs"><KeyRound className="h-4 w-4" aria-hidden="true" />Configuration du propriétaire<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          <Link to="/portail" className="cabinet-btn-secondary text-xs">Accéder au portail et à ses réglages</Link>
        </div>
        <p className="text-xs leading-relaxed text-[#6B7280]">Le mode développement décrit l’état de préparation. Il ne désactive pas les protections d’accès et ne constitue pas une validation de sécurité.</p>
      </div>
    )}
  </section>
);
