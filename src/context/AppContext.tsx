import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, Translations } from '../lib/i18n';
import { UserProfile, SavedField } from '../types/advisor';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  t: Translations;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  savedFields: SavedField[];
  addSavedField: (field: SavedField) => void;
  removeSavedField: (id: string) => void;
  updateFieldFeedback: (id: string, followed: 'yes' | 'partly' | 'no', yieldVsUsual: 'lower' | 'same' | 'higher') => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isMyFieldsOpen: boolean;
  setIsMyFieldsOpen: (open: boolean) => void;
}

const defaultUser: UserProfile = {
  id: 'guest_user_1',
  email: 'guest@example.com',
  name: 'Guest Grower',
  isGuest: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('rice_advisor_lang') as Language) || 'en';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('rice_advisor_theme') === 'dark';
  });

  const [user, setUserState] = useState<UserProfile>(() => {
    const stored = localStorage.getItem('rice_advisor_user');
    return stored ? JSON.parse(stored) : defaultUser;
  });

  const [savedFields, setSavedFields] = useState<SavedField[]>(() => {
    const stored = localStorage.getItem('rice_advisor_saved_fields');
    return stored ? JSON.parse(stored) : [];
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMyFieldsOpen, setIsMyFieldsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('rice_advisor_lang', language);
  }, [language]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rice_advisor_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rice_advisor_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('rice_advisor_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rice_advisor_saved_fields', JSON.stringify(savedFields));
  }, [savedFields]);

  // Fetch server-side saved fields on mount or user change
  useEffect(() => {
    const fetchRemote = async () => {
      try {
        const res = await fetch(`/api/saved-fields?user_id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.fields) && data.fields.length > 0) {
            setSavedFields(data.fields);
          }
        }
      } catch {
        // Local storage remains primary fallback
      }
    };
    fetchRemote();
  }, [user.id]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  const setUser = (newUser: UserProfile) => {
    setUserState(newUser);
  };

  const addSavedField = async (field: SavedField) => {
    setSavedFields(prev => [field, ...prev.filter(f => f.id !== field.id)]);
    try {
      await fetch('/api/saved-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(field),
      });
    } catch {
      // Offline fallback
    }
  };

  const removeSavedField = async (id: string) => {
    setSavedFields(prev => prev.filter(f => f.id !== id));
    try {
      await fetch(`/api/saved-fields/${id}?user_id=${user.id}`, { method: 'DELETE' });
    } catch {
      // Offline fallback
    }
  };

  const updateFieldFeedback = async (
    id: string,
    followed: 'yes' | 'partly' | 'no',
    yieldVsUsual: 'lower' | 'same' | 'higher'
  ) => {
    setSavedFields(prev =>
      prev.map(f => (f.id === id ? { ...f, followed_advice: followed, yield_vs_usual: yieldVsUsual } : f))
    );
    try {
      await fetch(`/api/saved-fields/${id}/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followed_advice: followed, yield_vs_usual: yieldVsUsual }),
      });
    } catch {
      // Offline fallback
    }
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isDark,
        toggleDarkMode,
        t,
        user,
        setUser,
        savedFields,
        addSavedField,
        removeSavedField,
        updateFieldFeedback,
        isAuthOpen,
        setIsAuthOpen,
        isMyFieldsOpen,
        setIsMyFieldsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
