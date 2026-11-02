/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Language } from './types';
import { CabinetProvider } from './context/CabinetContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { BookingModal } from './components/BookingModal';
import { DocumentVaultModal } from './components/DocumentVaultModal';
import { TaxAssistantWidget } from './components/TaxAssistantWidget';
import { CookieBanner } from './components/CookieBanner';
import { LegalModal } from './components/LegalModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { ServicesPage } from './pages/ServicesPage';
import { CreationEntreprisePage } from './pages/CreationEntreprisePage';
import { FiscalitePage } from './pages/FiscalitePage';
import { EComptaPage } from './pages/EComptaPage';
import { ToolsPage } from './pages/ToolsPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const [lang, setLang] = useState<Language>('fr');

  const [bookingOpen, setBookingOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);

  return (
    <div className="cabinet-premium fid-prestige min-h-screen flex flex-col font-sans bg-[#F7F6F2] text-[#1F2937]">
      <ScrollToTop />

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenBooking={() => setBookingOpen(true)}
        onOpenVault={() => setVaultOpen(true)}
      />

      {/* Router Viewport */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenBooking={() => setBookingOpen(true)}
                onOpenVault={() => setVaultOpen(true)}
              />
            }
          />
          <Route
            path="/a-propos"
            element={
              <AboutPage
                onOpenBooking={() => setBookingOpen(true)}
              />
            }
          />
          <Route
            path="/notre-equipe"
            element={
              <TeamPage
                onOpenBooking={() => setBookingOpen(true)}
              />
            }
          />
          <Route
            path="/services"
            element={
              <ServicesPage
                onOpenBooking={() => setBookingOpen(true)}
                onOpenVault={() => setVaultOpen(true)}
              />
            }
          />
          <Route
            path="/creation-entreprise"
            element={
              <CreationEntreprisePage
                onOpenBooking={() => setBookingOpen(true)}
              />
            }
          />
          <Route
            path="/fiscalite"
            element={
              <FiscalitePage
                onOpenBooking={() => setBookingOpen(true)}
              />
            }
          />
          <Route
            path="/e-compta"
            element={
              <EComptaPage
                onOpenVault={() => setVaultOpen(true)}
              />
            }
          />
          <Route path="/outils-simulateurs" element={<ToolsPage />} />
          <Route path="/actualites" element={<NewsPage />} />
          <Route
            path="/contact"
            element={
              <ContactPage onOpenBooking={() => setBookingOpen(true)} />
            }
          />
          <Route path="/mentions-legales" element={<LegalPage />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={
              <HomePage
                onOpenBooking={() => setBookingOpen(true)}
                onOpenVault={() => setVaultOpen(true)}
              />
            }
          />
        </Routes>
      </main>

      {/* Floating Widgets & Interactive Features */}
      <WhatsAppWidget
        onOpenBooking={() => setBookingOpen(true)}
        onOpenVault={() => setVaultOpen(true)}
      />

      <TaxAssistantWidget />

      {/* Modals & Dialogs */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      <DocumentVaultModal
        isOpen={vaultOpen}
        onClose={() => setVaultOpen(false)}
      />

      <LegalModal
        isOpen={legalOpen}
        onClose={() => setLegalOpen(false)}
      />

      {/* RGPD Cookie Banner */}
      <CookieBanner />

      {/* Footer */}
      <Footer
        onOpenBooking={() => setBookingOpen(true)}
        onOpenVault={() => setVaultOpen(true)}
        onOpenLegal={() => setLegalOpen(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CabinetProvider>
        <MainLayout />
      </CabinetProvider>
    </BrowserRouter>
  );
}
