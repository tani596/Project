import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StorySections } from './components/StorySections';
import { Workspace } from './components/Workspace/Workspace';
import { BasicsAndRoadmap } from './components/BasicsAndRoadmap';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SavedFieldsModal } from './components/SavedFieldsModal';
import { SavedField } from './types/advisor';

const MainApp: React.FC = () => {
  const { setIsAuthOpen, setIsMyFieldsOpen } = useApp();

  // Handle client-side routing like /app, /auth, /fields
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/app') {
      window.history.replaceState(null, '', '/');
    } else if (path === '/auth') {
      setIsAuthOpen(true);
      window.history.replaceState(null, '', '/');
    } else if (path === '/fields') {
      setIsMyFieldsOpen(true);
      window.history.replaceState(null, '', '/');
    }
  }, [setIsAuthOpen, setIsMyFieldsOpen]);

  const handleLoadSavedField = (_field: SavedField) => {
    // Scroll to workspace
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors max-w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 max-w-full overflow-x-hidden">
        <Hero />
        <StorySections />
        <Workspace />
        <BasicsAndRoadmap />
      </main>
      <Footer />
      <AuthModal />
      <SavedFieldsModal onLoadField={handleLoadSavedField} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
