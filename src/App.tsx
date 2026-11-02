/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Language } from './types';
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
import { ServicesPage } from './pages/ServicesPage';
import { ToolsPage } from './pages/ToolsPage';
import { NewsPage } from './pages/NewsPage';
import { ContactPage } from './pages/ContactPage';

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
    <div className="indusall-theme fid-prestige min-h-screen flex flex-col font-sans">
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
            path="/services"
            element={
              <ServicesPage
                onOpenBooking={() => setBookingOpen(true)}
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
      <MainLayout />
    </BrowserRouter>
  );
}
