import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const Transparenz = () => {
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Impressum & Datenschutz | Hertz an Hertz</title>
        <meta name="description" content="Impressum und Datenschutzerklärung für Hertz an Hertz." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="pt-4 pb-2 px-4 relative border-b border-border">
          <div className="absolute top-3 left-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-body text-foreground hover:text-heartbeat transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "de" ? "Zurück" : "Back"}
            </Link>
          </div>
          <div className="absolute top-3 right-4">
            <LanguageToggle />
          </div>
          <div className="text-center pt-8">
            <Link to="/">
              <h2 className="font-display text-2xl text-heartbeat hover:opacity-80 transition-opacity">
                Hertz an Hertz
              </h2>
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          <motion.article
            className="prose prose-lg dark:prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat mb-8">
              Impressum & Datenschutz
            </h1>

            <section className="space-y-6">
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
                <h2 className="font-display text-xl text-foreground mb-4">Impressum</h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Hier steht das Impressum.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 md:p-8 border border-border">
                <h2 className="font-display text-xl text-foreground mb-4">Datenschutzerklärung</h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Hier steht die Datenschutzerklärung.
                </p>
              </div>
            </section>
          </motion.article>
        </main>

        {/* Simple footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="text-center">
            <Link to="/">
              <p className="font-display text-xl text-heartbeat hover:opacity-80 transition-opacity">
                Hertz an Hertz
              </p>
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Transparenz;
