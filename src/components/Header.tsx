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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 flex items-center justify-center shadow-xs">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-foreground block leading-tight">
              {t.appName}
            </span>
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 block -mt-0.5">
              IRRI & ICAR Agronomic Alignment
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
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg border border-border bg-muted-bg hover:bg-card text-foreground transition-all"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User / Sign In Button */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
              user.isGuest
                ? 'border-emerald-600/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                : 'border-border bg-card text-foreground hover:bg-muted-bg'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{user.isGuest ? t.navSignIn : user.name.split(' ')[0]}</span>
            {!user.isGuest && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
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
            aria-label="Toggle dark mode"
            className="p-1.5 rounded border border-border bg-muted-bg text-foreground"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
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
