import React, { useState } from 'react';
import { BookingData } from '../types';
import { TEAM_MEMBERS } from '../data/mockData';
import { X, Calendar, Clock, MapPin, Video, Phone, CheckCircle2, Download, User, ShieldCheck, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [booking, setBooking] = useState<BookingData>({
    motif: 'Premier contact / Création',
    modality: 'En cabinet (Ganshoren)' as any,
    expertId: 'paul-holl-mpeck',
    date: '2026-04-18',
    timeSlot: '10:00',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    companyName: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const availableSlots = ['09:00', '10:00', '11:30', '14:00', '15:30', '17:00'];
  const selectedExpert = TEAM_MEMBERS.find(m => m.id === booking.expertId) || TEAM_MEMBERS[0];

  const handleDownloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FIDCOGEST SRL Cabinet Comptable//RDV Expert//FR
BEGIN:VEVENT
SUMMARY:RDV Fidcogest - ${booking.motif}
DESCRIPTION:Rendez-vous fiscal et comptable avec ${selectedExpert.name} (Fidcogest ITAA).\nModalité: ${booking.modality}
LOCATION:${booking.modality.includes('Ganshoren') ? 'Place de la Reine Paola 3, 1083 Ganshoren, Bruxelles' : 'Visioconférence (Lien transmis par email)'}
DTSTART:20260418T100000Z
DTEND:20260418T110000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Rendez-vous_Fidcogest.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden text-[#1F2937] my-8 animate-in fade-in zoom-in-95 duration-200 modal-white-card">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#1D3B5C] bg-[#142B45] text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 text-[#F3D085] border border-white/20 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              <Calendar className="w-5 h-5 text-[#F3D085]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Prise de Rendez-vous en Ligne
              </h3>
              <p className="text-xs text-[#E2E8F0] flex items-center gap-1.5 font-sans mt-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F3D085]" />
                Cabinet Fidcogest • Agendas Certifiés ITAA Synchronisés
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isSubmitted && (
          <div className="px-6 py-3 bg-[#FAF9F6] border-b border-[#E8E6DF] flex items-center justify-between text-xs font-sans">
            {[
              { num: 1, label: 'Motif & Modalité' },
              { num: 2, label: 'Conseiller & Date' },
              { num: 3, label: 'Coordonnées' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span
                  style={{ color: step >= s.num ? '#FFFFFF' : '#4B5563' }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-[#142B45] text-white shadow-xs'
                      : step > s.num
                      ? 'bg-[#B79661] text-white'
                      : 'bg-white border border-[#E8E6DF] text-[#4B5563]'
                  }`}
                >
                  {s.num}
                </span>
                <span
                  style={{ color: step === s.num ? '#142B45' : '#4B5563' }}
                  className={`text-xs ${step === s.num ? 'font-bold text-[#142B45]' : 'text-[#4B5563] hidden sm:inline'}`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#142B45] text-[#B79661] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-serif font-bold text-[#142B45]">
                  Rendez-vous Confirmé avec Succès
                </h4>
                <p className="text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
                  Une confirmation officielle ainsi qu'un rappel d'agenda ont été envoyés à <strong className="text-[#142B45]">{booking.clientEmail}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#F7F6F2] border border-[#E8E6DF] rounded-xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5 font-sans">
                <div className="flex justify-between border-b border-[#E8E6DF] pb-2">
                  <span className="text-[#6B7280]">Objet :</span>
                  <span className="font-semibold text-[#142B45]">{booking.motif}</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E6DF] pb-2">
                  <span className="text-[#6B7280]">Associé référent :</span>
                  <span className="font-semibold text-[#B79661]">{selectedExpert.name} ({selectedExpert.itaaNumber})</span>
                </div>
                <div className="flex justify-between border-b border-[#E8E6DF] pb-2">
                  <span className="text-[#6B7280]">Créneau fixé :</span>
                  <span className="font-mono font-bold text-[#142B45]">{booking.date} à {booking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Modalité :</span>
                  <span className="font-medium text-[#374151]">{booking.modality}</span>
                </div>
              </div>

              {/* Download .ics button & Close */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleDownloadIcs}
                  className="cabinet-btn-primary text-xs w-full sm:w-auto"
                >
                  <Download className="w-4 h-4" />
                  Ajouter à mon Agenda (.ics)
                </button>
                <button
                  onClick={onClose}
                  className="cabinet-btn-secondary text-xs w-full sm:w-auto"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP 1: Motif & Modalité */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2.5">
                      1. Objet principal de votre consultation :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Premier contact / Création',
                        'Bilan annuel & Clôture',
                        'Conseil fiscal ponctuel',
                        'Remise de documents / TVA'
                      ].map((m) => {
                        const isSelected = booking.motif === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setBooking({ ...booking, motif: m as any })}
                            className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#142B45] !text-white border-[#142B45] shadow-xs'
                                : 'bg-white border-[#E8E6DF] text-[#374151] hover:border-[#B79661] hover:text-[#142B45]'
                            }`}
                          >
                            <span
                              style={{ color: isSelected ? '#FFFFFF' : '#374151' }}
                              className={isSelected ? '!text-white text-white font-bold' : 'text-[#374151]'}
                            >
                              {m}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2.5">
                      2. Modalité souhaitée :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'En cabinet (Ganshoren)', icon: MapPin },
                        { label: 'Visioconférence (Meet/Teams)', icon: Video },
                        { label: 'Téléphonique', icon: Phone }
                      ].map((mod) => {
                        const Icon = mod.icon;
                        const isSelected = booking.modality === mod.label;
                        return (
                          <button
                            key={mod.label}
                            type="button"
                            onClick={() => setBooking({ ...booking, modality: mod.label as any })}
                            className={`p-3.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#142B45] !text-white border-[#142B45] shadow-xs font-semibold'
                                : 'bg-white border-[#E8E6DF] text-[#374151] hover:border-[#B79661] hover:text-[#142B45]'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#F3D085]' : 'text-[#6B7280]'}`} />
                            <span
                              style={{ color: isSelected ? '#FFFFFF' : '#374151' }}
                              className={isSelected ? '!text-white text-white font-bold' : 'text-[#374151]'}
                            >
                              {mod.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="cabinet-btn-primary text-xs"
                    >
                      Suivant : Conseiller &amp; Date →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Expert & Date */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2.5">
                      1. Conseiller fiscal ou expert-comptable référent :
                    </label>
                    <div className="space-y-2.5">
                      {TEAM_MEMBERS.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setBooking({ ...booking, expertId: member.id })}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3.5 transition-all ${
                            booking.expertId === member.id
                              ? 'bg-[#142B45] text-white border-[#142B45] shadow-xs'
                              : 'bg-white border-[#E8E6DF] text-[#4B5563] hover:border-[#B79661]'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm shrink-0 ${
                            booking.expertId === member.id ? 'bg-[#F3D085] text-[#0D1E30]' : 'bg-[#F7F6F2] text-[#142B45] border border-[#E8E6DF]'
                          }`}>
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-xs">
                            <div className={`font-serif font-bold text-sm ${booking.expertId === member.id ? 'text-white' : 'text-[#142B45]'}`}>
                              {member.name}
                            </div>
                            <div className={booking.expertId === member.id ? 'text-[#F1F5F9] font-medium' : 'text-[#4B5563]'}>
                              {member.role}
                            </div>
                          </div>
                          <span className={`text-xs font-mono px-2.5 py-1 rounded font-semibold ${
                            booking.expertId === member.id ? 'bg-white/15 text-[#F3D085] border border-[#F3D085]/40' : 'bg-[#F7F6F2] text-[#8C6A34] border border-[#E8E6DF]'
                          }`}>
                            {member.itaaNumber}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2">
                        2. Date souhaitée :
                      </label>
                      <input
                        type="date"
                        value={booking.date}
                        min="2026-04-12"
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        className="cabinet-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2">
                        3. Heure de consultation :
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => {
                          const isSelected = booking.timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBooking({ ...booking, timeSlot: slot })}
                              className={`py-2 px-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#142B45] !text-white border-[#142B45]'
                                  : 'bg-white border-[#E8E6DF] text-[#374151] hover:border-[#B79661] hover:text-[#142B45]'
                              }`}
                            >
                              <span
                                style={{ color: isSelected ? '#FFFFFF' : '#374151' }}
                                className={isSelected ? '!text-white text-white font-bold' : 'text-[#374151]'}
                              >
                                {slot}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="cabinet-btn-secondary text-xs"
                    >
                      ← Étape précédente
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="cabinet-btn-primary text-xs"
                    >
                      Suivant : Coordonnées →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Client Info */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] mb-1.5">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={booking.clientName}
                        onChange={(e) => setBooking({ ...booking, clientName: e.target.value })}
                        placeholder="Jean Dupont"
                        className="cabinet-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] mb-1.5">Société / Projet</label>
                      <input
                        type="text"
                        value={booking.companyName}
                        onChange={(e) => setBooking({ ...booking, companyName: e.target.value })}
                        placeholder="SRL Dupont Consulting (ou en création)"
                        className="cabinet-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] mb-1.5">Adresse Email *</label>
                      <input
                        type="email"
                        required
                        value={booking.clientEmail}
                        onChange={(e) => setBooking({ ...booking, clientEmail: e.target.value })}
                        placeholder="jean.dupont@exemple.be"
                        className="cabinet-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] mb-1.5">Téléphone (Rappel SMS) *</label>
                      <input
                        type="tel"
                        required
                        value={booking.clientPhone}
                        onChange={(e) => setBooking({ ...booking, clientPhone: e.target.value })}
                        placeholder="+32 470 12 34 56"
                        className="cabinet-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] mb-1.5">Précisions utiles pour l'expert</label>
                    <textarea
                      rows={3}
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      placeholder="Décrivez brièvement votre projet ou vos attentes..."
                      className="cabinet-input"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="cabinet-btn-secondary text-xs"
                    >
                      ← Retour
                    </button>
                    <button
                      type="submit"
                      className="cabinet-btn-primary text-xs"
                    >
                      Confirmer le Rendez-vous ✓
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
