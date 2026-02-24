"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "./en";
import { fr } from "./fr";

export type Language = "en" | "fr";
export type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations = { en, fr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get saved language from localStorage or detect from browser
    const saved = localStorage.getItem("pharmalink-language") as Language;
    if (saved && (saved === "en" || saved === "fr")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "fr") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState("fr");
      }
    }
    setMounted(true);
      // eslint-disable-next-line react-hooks/set-state-in-effect
}, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("pharmalink-language", lang);
  };

  // Always provide context - default to English during SSG until mounted on client
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  // Return default English translations during SSG or when not wrapped in provider
  if (!context) {
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: en
    };
  }
  return context;
}
