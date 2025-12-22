import { useLanguage, Language } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 bg-card/80 backdrop-blur-sm rounded-full p-1 border border-border shadow-sm">
      <button
        onClick={() => toggleLanguage("en")}
        className={`relative px-3 py-1.5 rounded-full font-body text-sm font-medium transition-colors ${
          language === "en" ? "text-primary-foreground" : "text-ink-light hover:text-ink"
        }`}
      >
        {language === "en" && (
          <motion.div
            layoutId="languageToggle"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
      <button
        onClick={() => toggleLanguage("de")}
        className={`relative px-3 py-1.5 rounded-full font-body text-sm font-medium transition-colors ${
          language === "de" ? "text-primary-foreground" : "text-ink-light hover:text-ink"
        }`}
      >
        {language === "de" && (
          <motion.div
            layoutId="languageToggle"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">DE</span>
      </button>
    </div>
  );
};
