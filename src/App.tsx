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
import { BookingModal } from './components/BookingModal';
import { DocumentVaultModal } from './components/DocumentVaultModal';
import { FloatingActions } from './components/ui';
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
import { PortalPage } from './pages/PortalPage';
import { PortalProvider } from './context/PortalContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const { pathname } = useLocation();
  const isPortal = pathname.startsWith('/portail') || pathname.startsWith('/espace-client');

  const [lang, setLang] = useState<Language>('fr');

  const [bookingOpen, setBookingOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [activeFloatingWidget, setActiveFloatingWidget] = useState<'none' | 'whatsapp' | 'tax-assistant'>('none');

  // Close floating widget drawers when any full modal opens
  const handleOpenBooking = () => {
    setActiveFloatingWidget('none');
    setBookingOpen(true);
  };

  const handleOpenVault = () => {
    setActiveFloatingWidget('none');
    setVaultOpen(true);
  };

  const handleOpenLegal = () => {
    setActiveFloatingWidget('none');
    setLegalOpen(true);
  };

  // Dedicated portal interface without public site chrome
  if (isPortal) {
    return (
      <div className="cabinet-premium fid-prestige min-h-screen flex flex-col font-sans bg-[#F7F6F2] text-[#1F2937]">
        <ScrollToTop />
        <Routes>
          <Route path="/portail" element={<PortalPage />} />
          <Route path="/espace-client" element={<PortalPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="cabinet-premium fid-prestige min-h-screen flex flex-col font-sans bg-[#F7F6F2] text-[#1F2937]">
      <ScrollToTop />

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenBooking={handleOpenBooking}
        onOpenVault={handleOpenVault}
      />

      {/* Router Viewport */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                lang={lang}
                onOpenBooking={handleOpenBooking}
                onOpenVault={handleOpenVault}
              />
            }
          />
          <Route
            path="/a-propos"
            element={
              <AboutPage
                onOpenBooking={handleOpenBooking}
              />
            }
          />
          <Route
            path="/notre-equipe"
            element={
              <TeamPage
                onOpenBooking={handleOpenBooking}
              />
            }
          />
          <Route
            path="/services"
            element={
              <ServicesPage
                onOpenBooking={handleOpenBooking}
                onOpenVault={handleOpenVault}
              />
            }
          />
          <Route
            path="/creation-entreprise"
            element={
              <CreationEntreprisePage
                onOpenBooking={handleOpenBooking}
              />
            }
          />
          <Route
            path="/fiscalite"
            element={
              <FiscalitePage
                onOpenBooking={handleOpenBooking}
              />
            }
          />
          <Route
            path="/e-compta"
            element={
              <EComptaPage
                onOpenVault={handleOpenVault}
              />
            }
          />
          <Route path="/outils-simulateurs" element={<ToolsPage />} />
          <Route path="/actualites" element={<NewsPage />} />
          <Route
            path="/contact"
            element={
              <ContactPage onOpenBooking={handleOpenBooking} />
            }
          />
          <Route path="/mentions-legales" element={<LegalPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/portail" element={<PortalPage />} />
          <Route path="/espace-client" element={<PortalPage />} />

          {/* Catch-all fallback */}
          <Route
            path="*"
            element={
              <HomePage
                onOpenBooking={handleOpenBooking}
                onOpenVault={handleOpenVault}
              />
            }
          />
        </Routes>
      </main>

      {/* Floating Actions (Assistant IA & WhatsApp) */}
      <FloatingActions
        onOpenBooking={handleOpenBooking}
        onOpenVault={handleOpenVault}
      />

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
        onOpenBooking={handleOpenBooking}
        onOpenVault={handleOpenVault}
        onOpenLegal={handleOpenLegal}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallbackTitle="FIDCOGEST — Protection Système Cabinet">
      <BrowserRouter>
        <CabinetProvider>
          <ErrorBoundary fallbackTitle="Portail Documentaire Sécurisé — Incident Isolé">
            <PortalProvider>
              <MainLayout />
            </PortalProvider>
          </ErrorBoundary>
        </CabinetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
