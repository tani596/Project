import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, CheckCircle2, Shield, LogIn } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, user, setUser, t } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  if (!isAuthOpen) return null;

  const handleSignIn = (name: string, email: string) => {
    setUser({
      id: 'usr_' + Math.abs(email.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)),
      email,
      name,
      isGuest: false,
    });
    setIsAuthOpen(false);
  };

  const handleGuestContinue = () => {
    setUser({
      id: 'guest_user_1',
      email: 'guest@example.com',
      name: 'Guest Grower',
      isGuest: true,
    });
    setIsAuthOpen(false);
  };

  const handleSignOut = () => {
    handleGuestContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-6 relative opacity-100">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                {user.isGuest ? 'Grower Account Access' : 'Grower Profile'}
              </h3>
              <p className="text-xs text-foreground/70">
                Rice-field Methane & Yield Advisor
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted-bg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!user.isGuest ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Signed In</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 rounded-xl border border-border hover:bg-muted-bg text-foreground font-semibold text-xs transition-all cursor-pointer"
            >
              Sign Out (Switch to Guest Mode)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-foreground/80 leading-relaxed">
              Sign in to sync your saved paddies, action checklists, and season feedback. The Advisor workspace always remains completely open with no login required.
            </p>

            {/* Quick Mock Google Sign In */}
            <button
              onClick={() => handleSignIn('Tanishq (Field Agronomist)', 'tanishq1908@gmail.com')}
              className="w-full py-3 px-4 rounded-xl border border-border bg-card hover:bg-muted-bg text-foreground font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Email form */}
            <div className="relative py-2 text-center text-xs text-muted">
              <span className="bg-card px-2">or sign in with field email</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (emailInput) {
                  handleSignIn(nameInput || 'Paddy Grower', emailInput);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Grower Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Singh"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="grower@farm.org"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </form>

            <div className="pt-2 border-t border-border">
              <button
                onClick={handleGuestContinue}
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-muted-bg hover:bg-card text-foreground font-semibold text-xs cursor-pointer"
              >
                Continue as Guest (Full Advisor Access)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
