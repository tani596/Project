import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Moon, Sun, Globe, User, Bookmark, Menu, X, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, isDark, toggleDarkMode, t, user, setIsAuthOpen, setIsMyFieldsOpen, savedFields } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 flex items-center justify-center shadow-xs shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="font-display font-bold text-sm sm:text-lg lg:text-xl tracking-tight text-foreground block leading-tight truncate">
              {t.appName}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-emerald-800 dark:text-emerald-400 block -mt-0.5 truncate">
              Stage-Aware Field Rules
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <button
            onClick={scrollToWorkspace}
            className="text-sm font-medium text-foreground/80 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
          >
            {t.navAdvisor}
          </button>

          <button
            onClick={() => setIsMyFieldsOpen(true)}
            className="text-sm font-medium text-foreground/80 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors flex items-center space-x-1.5 relative"
          >
            <Bookmark className="w-4 h-4" />
            <span>{t.navMyFields}</span>
            {savedFields.length > 0 && (
              <span className="ml-1 text-xs px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold">
                {savedFields.length}
              </span>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            aria-label="Toggle language between English and Hindi"
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-muted-bg hover:bg-card text-foreground flex items-center space-x-1 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-muted" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-lg border border-border bg-muted-bg hover:bg-card text-foreground transition-all cursor-pointer flex items-center justify-center shadow-xs"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-800 transition-transform duration-300 -rotate-12 hover:rotate-0" />
            )}
          </button>

          {/* User / Sign In Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="text-sm font-semibold px-3 py-1.5 rounded-lg border border-[#004036] bg-[#002c25] text-white hover:bg-[#003830] transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <User className="w-4 h-4 text-emerald-300" />
            <span>{user.isGuest ? t.navSignIn : user.name.split(' ')[0]}</span>
            {!user.isGuest && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="text-xs font-bold px-2 py-1 rounded border border-border bg-muted-bg text-foreground"
          >
            {language === 'en' ? 'हि' : 'EN'}
          </button>
          <button
            onClick={toggleDarkMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-1.5 rounded-lg border border-border bg-muted-bg text-foreground cursor-pointer flex items-center justify-center"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-800" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted-bg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-3 pb-4 space-y-2">
          <button
            onClick={scrollToWorkspace}
            className="w-full text-left font-medium text-foreground py-2 px-3 rounded-lg hover:bg-muted-bg"
          >
            {t.navAdvisor}
          </button>
          <button
            onClick={() => {
              setIsMyFieldsOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-medium text-foreground py-2 px-3 rounded-lg hover:bg-muted-bg flex items-center justify-between"
          >
            <span className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4" />
              <span>{t.navMyFields}</span>
            </span>
            {savedFields.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold">
                {savedFields.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setIsAuthOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left font-medium text-foreground py-2 px-3 rounded-lg hover:bg-muted-bg flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>{user.isGuest ? t.navSignIn : `${user.name} (${t.navSignOut})`}</span>
          </button>
        </div>
      )}
    </header>
  );
};
