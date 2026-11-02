import React, { useState } from 'react';
import { BookingData } from '../types';
import { TEAM_MEMBERS } from '../data/mockData';
import { X, Calendar, Clock, MapPin, Video, Phone, CheckCircle2, Download, User, ShieldCheck, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [booking, setBooking] = useState<BookingData>({
    motif: 'Premier contact / Création',
    modality: 'En cabinet (Bruxelles)',
    expertId: 'marc-vdb',
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
PRODID:-//Fidcogest Cabinet Comptable//RDV Expert//FR
BEGIN:VEVENT
SUMMARY:RDV Fidcogest - ${booking.motif}
DESCRIPTION:Rendez-vous fiscal et comptable avec ${selectedExpert.name} (Fidcogest ITAA).\nModalité: ${booking.modality}
LOCATION:${booking.modality.includes('Bruxelles') ? 'Avenue Louise 240, 1050 Bruxelles' : booking.modality.includes('Mons') ? 'Boulevard Dolez 12, 7000 Mons' : 'Visioconférence (Lien transmis par email)'}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Prise de Rendez-vous en Ligne Intelligente
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Cabinet Fidcogest • Agendas Experts Synchronisés
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isSubmitted && (
          <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between text-xs font-mono">
            {[
              { num: 1, label: 'Motif & Modalité' },
              { num: 2, label: 'Expert & Date' },
              { num: 3, label: 'Coordonnées' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-950'
                      : step > s.num
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {s.num}
                </span>
                <span className={step === s.num ? 'text-amber-300 font-semibold' : 'text-slate-400 hidden sm:inline'}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-display font-bold text-white">
                  Rendez-vous Confirmé avec Succès !
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Un email de confirmation ainsi qu'un rappel SMS programmés ont été envoyés à <strong className="text-amber-400">{booking.clientEmail}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2 font-sans">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Motif :</span>
                  <span className="font-semibold text-white">{booking.motif}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Expert :</span>
                  <span className="font-semibold text-amber-300">{selectedExpert.name} ({selectedExpert.itaaNumber})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Date & Heure :</span>
                  <span className="font-mono text-emerald-400">{booking.date} à {booking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Modalité :</span>
                  <span className="font-medium text-slate-200">{booking.modality}</span>
                </div>
              </div>

              {/* Download .ics button */}
              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  onClick={handleDownloadIcs}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" />
                  Ajouter à mon Agenda (.ics)
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP 1: Motif & Modalité */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                      1. Sélectionnez le motif de votre rendez-vous :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Premier contact / Création',
                        'Bilan annuel & Clôture',
                        'Conseil fiscal ponctuel',
                        'Remise de documents / TVA'
                      ].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setBooking({ ...booking, motif: m as any })}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                            booking.motif === m
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                      2. Modalité souhaitée :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { label: 'En cabinet (Bruxelles)', icon: MapPin },
                        { label: 'En cabinet (Mons)', icon: MapPin },
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
                            className={`p-3 rounded-xl border text-left text-xs flex items-center gap-2 transition-all ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{mod.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-amber-500/10"
                    >
                      Suivant : Choisir l'Expert & Créneau →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Expert & Date */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                      1. Choisir votre Conseiller Fiscal / Expert-Comptable :
                    </label>
                    <div className="space-y-2">
                      {TEAM_MEMBERS.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setBooking({ ...booking, expertId: member.id })}
                          className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            booking.expertId === member.id
                              ? 'bg-amber-500/10 border-amber-500 text-white'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-xs">
                            <div className="font-bold text-slate-100">{member.name}</div>
                            <div className="text-[11px] text-slate-400">{member.role}</div>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                            {member.itaaNumber}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                        2. Date du rendez-vous :
                      </label>
                      <input
                        type="date"
                        value={booking.date}
                        min="2026-04-12"
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                        3. Heure disponible :
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBooking({ ...booking, timeSlot: slot })}
                            className={`py-1.5 px-2 rounded-lg border text-xs font-mono transition-colors ${
                              booking.timeSlot === slot
                                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
                    >
                      ← Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                    >
                      Suivant : Saisir vos coordonnes →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Client Info */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={booking.clientName}
                        onChange={(e) => setBooking({ ...booking, clientName: e.target.value })}
                        placeholder="ex. Jean Dupont"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Société / Nom commercial</label>
                      <input
                        type="text"
                        value={booking.companyName}
                        onChange={(e) => setBooking({ ...booking, companyName: e.target.value })}
                        placeholder="ex. SRL TechSolutions (ou projet)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Adresse Email *</label>
                      <input
                        type="email"
                        required
                        value={booking.clientEmail}
                        onChange={(e) => setBooking({ ...booking, clientEmail: e.target.value })}
                        placeholder="jean.dupont@exemple.be"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Téléphone (Rappel SMS) *</label>
                      <input
                        type="tel"
                        required
                        value={booking.clientPhone}
                        onChange={(e) => setBooking({ ...booking, clientPhone: e.target.value })}
                        placeholder="+32 470 12 34 56"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Précisions ou questions particulières pour l'expert</label>
                    <textarea
                      rows={3}
                      value={booking.notes}
                      onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                      placeholder="Décrivez brièvement votre projet ou vos attentes (ex. Création SRL, bilan annuel, conseil TVA...)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
                    >
                      ← Retour
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all"
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
