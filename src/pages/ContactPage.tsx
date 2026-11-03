import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Send, CheckCircle2, Building, Calendar, ArrowRight, Smartphone } from 'lucide-react';

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
  const { config } = useCabinet();
  const { cabinet } = config;

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Demande de Rendez-vous',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <Building className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">Siège Officiel du Cabinet • Ganshoren (Bruxelles)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            Contact, Accès &amp; Rendez-vous
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Échangez directement avec <strong>Paul Holl Mpeck</strong> ou l'un de nos conseillers fiscaux certifiés ITAA. Nos bureaux vous accueillent à Ganshoren sur rendez-vous ou en visioconférence.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Office Coordinates */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="cabinet-card p-7 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#142B45]">
                    {cabinet.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Siège social &amp; Bureaux de consultation
                  </p>
                </div>
                <span className="cabinet-badge-itaa">
                  Agrément ITAA
                </span>
              </div>

              <div className="space-y-4 text-sm text-[#374151]">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center shrink-0 text-[#B79661]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] font-medium block">Adresse physique</span>
                    <span className="font-medium text-[#1F2937]">
                      {cabinet.headquarters.address}, {cabinet.headquarters.postalCode} {cabinet.headquarters.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center shrink-0 text-[#B79661]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] font-medium block">Ligne fixe du secrétariat</span>
                    <a
                      href={`tel:${cabinet.phone.replace(/[^0-9+]/g, '')}`}
                      className="font-bold text-[#142B45] hover:text-[#B79661] transition-colors font-mono"
                    >
                      {cabinet.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center shrink-0 text-[#B79661]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] font-medium block">Ligne mobile / GSM</span>
                    <a
                      href={`tel:${cabinet.mobile.replace(/[^0-9+]/g, '')}`}
                      className="font-bold text-[#142B45] hover:text-[#B79661] transition-colors font-mono"
                    >
                      {cabinet.mobile}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center shrink-0 text-[#B79661]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] font-medium block">Courrier électronique officiel</span>
                    <a href={`mailto:${cabinet.email}`} className="font-medium text-[#142B45] hover:underline block">
                      {cabinet.email}
                    </a>
                    <a href={`mailto:${cabinet.secondaryEmail}`} className="text-xs text-[#6B7280] hover:underline block">
                      {cabinet.secondaryEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center shrink-0 text-[#B79661]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] font-medium block">Horaires d'ouverture</span>
                    <span className="text-[#4B5563]">
                      {cabinet.openingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Legal Identifiers Card */}
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-1 text-xs font-mono">
                <div><strong>Numéro BCE &amp; TVA :</strong> {cabinet.vatNumber}</div>
                <div><strong>Identifiant Peppol B2B :</strong> {cabinet.peppolIdentifier}</div>
              </div>

              {/* Map Location Card */}
              <div className="relative h-44 rounded-xl bg-gradient-to-br from-[#142B45]/5 to-[#B79661]/10 border border-[#E8E6DF] overflow-hidden flex flex-col items-center justify-center text-center p-4">
                <MapPin className="w-8 h-8 text-[#B79661] mb-2" />
                <div className="font-serif font-bold text-[#142B45] text-sm">
                  {cabinet.headquarters.address}
                </div>
                <div className="text-xs text-[#6B7280] mb-3">
                  1083 Ganshoren, Bruxelles • Parking aisé
                </div>
                <a
                  href={cabinet.headquarters.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#142B45] text-white font-medium text-xs rounded-lg hover:bg-[#1D3B5C] transition-colors shadow-xs"
                >
                  <span>Ouvrir dans Google Maps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Fast Booking CTA */}
              <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-between">
                <span className="text-xs text-[#6B7280]">Besoin d'un créneau dédié ?</span>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="text-xs font-semibold text-[#142B45] hover:text-[#B79661] flex items-center gap-1 underline underline-offset-4"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#B79661]" />
                  Prendre rendez-vous en ligne
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Secure Contact Form */}
          <div className="lg:col-span-7 cabinet-card p-7 sm:p-9 space-y-6">
            <div className="border-b border-[#E8E6DF] pb-4">
              <div className="flex items-center gap-2 text-xs font-serif text-[#B79661] font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Secret Professionnel ITAA Garanti (Art. 458 CP)</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#142B45]">
                Formulaire de Contact &amp; Demande de Renseignements
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1">
                Transmettez votre demande directement à Paul Holl Mpeck et à notre équipe. Réponse garantie sous 24h ouvrées.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 text-center space-y-4 rounded-xl bg-[#F7F6F2] border border-[#B79661]/40">
                <div className="w-14 h-14 rounded-full bg-[#142B45] text-[#B79661] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-[#142B45]">
                  Votre Message a été Transmis avec Succès
                </h4>
                <p className="text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
                  Un gestionnaire de dossier du cabinet Fidcogest analysera vos éléments et prendra contact avec vous sous <strong className="text-[#142B45]">24 heures ouvrées</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="cabinet-btn-secondary text-xs"
                  >
                    Envoyer une autre demande
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] mb-1.5">
                      Nom &amp; Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jean Dupont"
                      className="cabinet-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] mb-1.5">
                      Société / Numéro BCE (facultatif)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="SRL Dupont / BE 0123.456.789"
                      className="cabinet-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] mb-1.5">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jean.dupont@entreprise.be"
                      className="cabinet-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] mb-1.5">
                      Numéro de Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+32 470 00 00 00"
                      className="cabinet-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B45] mb-1.5">
                    Nature de votre demande *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="cabinet-select"
                  >
                    <option value="Demande de Rendez-vous">Demande de Rendez-vous avec Paul Holl Mpeck</option>
                    <option value="Création de Société / Plan Financier">Création d'Entreprise (SRL) &amp; Plan Financier Notarié</option>
                    <option value="Comptabilité & Bilan Annuel">Tenue Comptable, TVA &amp; Bilan Annuel BNB</option>
                    <option value="Fiscalité & Contrôle Fiscal">Conseil Fiscal, IPP/ISOC &amp; Assistance Contrôle Fiscal</option>
                    <option value="Audit & Restructuration">Audit Comptable, Évaluation ou Restructuration</option>
                    <option value="E-Compta & Peppol 2026">Information E-Compta &amp; Facturation Peppol 2026</option>
                    <option value="Autre demande">Autre sujet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B45] mb-1.5">
                    Détails de votre situation ou projet *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Indiquez brièvement votre activité, vos questions fiscales ou vos besoins comptables..."
                    className="cabinet-input"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E6DF]">
                  <span className="text-xs text-[#6B7280] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#B79661] shrink-0" />
                    Chiffrement TLS 256-bit • Secret professionnel garanti.
                  </span>

                  <button
                    type="submit"
                    className="cabinet-btn-primary w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4" />
                    Transmettre ma demande
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
