import { useState, useEffect } from "react";

import type { ReactNode } from "react";

import { LanguageContext } from "../context/LangugeContext";
import type { Language } from "../context/LanguageContextTypes";


export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "ar" : "en"));

    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
