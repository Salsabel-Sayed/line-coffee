export type Language = "en" | "ar";

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}
