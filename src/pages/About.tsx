import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Database } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

// Import historical Hartschierle paintings
import hartschierleWanderer from "@/assets/hartschierle-wanderer.png";
import hartschierleMadonna from "@/assets/hartschierle-madonna.png";
import hartschierleWandererCape from "@/assets/hartschierle-wanderer-cape.png";
import hartschierleFloetenspieler from "@/assets/hartschierle-floetenspieler.png";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const About = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>About Hertz an Hertz - Where Science Meets Heartbeat</title>
        <meta name="description" content="Learn about the philosophy behind Hertz an Hertz: Where science meets heartbeat and technology meets tradition." />
      </Helmet>

      <div className="min-h-screen gradient-warm">
        {/* Header */}
        <header className="pt-4 pb-2 px-4 relative">
          <div className="absolute top-3 left-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-body text-ink hover:text-heartbeat transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("about.back")}
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

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-16">
          {/* Hero Section */}
          <motion.section 
            className="text-center space-y-6"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="font-display text-4xl md:text-5xl text-heartbeat"
              variants={fadeInUp}
            >
              {t("about.title")}
            </motion.h1>
            <motion.h2 
              className="font-body text-xl md:text-2xl text-ink/80 italic max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              {t("about.subtitle")}
            </motion.h2>
            <motion.div 
              className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4"
              variants={fadeInUp}
            >
              <p>
                {t("about.intro.p1")}
              </p>
              <p>
                {t("about.intro.p2")}
              </p>
              <p>
                {t("about.intro.p3")}
              </p>
            </motion.div>
          </motion.section>

          {/* First Figure - After intro */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={hartschierleWandererCape} 
              alt="Hartschierle - Man with cape"
              className="h-48 md:h-64 w-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Council of the Wise */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat text-center">
              {t("about.council.title")}
            </h1>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              {t("about.council.intro")}
            </p>
            <p className="font-body text-ink/80 text-center italic">
              {t("about.council.subtitle")}
            </p>

            {/* International Pioneers */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink border-b border-border pb-2">
                {t("about.pioneers.title")}
              </h3>
              <ul className="space-y-6">
                <li className="font-body text-ink/70 leading-relaxed">
                  {t("about.pioneers.gottman")}
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  {t("about.pioneers.perel")}
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  {t("about.pioneers.johnson")}
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  {t("about.pioneers.real")}
                </li>
              </ul>
            </div>

            {/* European Grounding */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink border-b border-border pb-2">
                {t("about.european.title")}
              </h3>
              <p className="font-body text-ink/70 leading-relaxed">
                {t("about.european.intro")}
              </p>
              <ul className="space-y-6">
                <li className="font-body text-ink/70 leading-relaxed">
                  {t("about.european.stahl")}
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  {t("about.european.mary")}
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  {t("about.european.holzberg")}
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Technology Section */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat text-center">
              {t("about.tech.title")}
            </h1>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              {t("about.tech.intro")}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  {t("about.tech.card1.title")}
                </h3>
                <p className="font-body text-ink/70 text-sm leading-relaxed">
                  {t("about.tech.card1.text")}
                </p>
              </div>

              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  {t("about.tech.card2.title")}
                </h3>
                <p className="font-body text-ink/70 text-sm leading-relaxed">
                  {t("about.tech.card2.text")}
                </p>
              </div>

              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  {t("about.tech.card3.title")}
                </h3>
                <div className="font-body text-ink/70 text-sm leading-relaxed space-y-2">
                  <p className="font-semibold text-ink">{t("about.tech.card3.subtitle")}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t("about.tech.card3.noTraining")}</li>
                    <li>{t("about.tech.card3.gdpr")}</li>
                    <li>{t("about.tech.card3.dataEconomy")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Grandfather Hartschierle */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat text-center">
              {t("about.soul.title")}
            </h1>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={hartschierleFloetenspieler} 
                alt="Hartschierle - Flute player by the tree"
                className="h-56 md:h-72 w-auto object-contain drop-shadow-lg"
              />
            </motion.div>

            <div className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4 text-center">
              <p>{t("about.soul.p1")}</p>
              <p className="font-semibold text-ink">{t("about.soul.intro")}</p>
              <p>{t("about.soul.p2")}</p>
              <p>{t("about.soul.p3")}</p>
              <p>{t("about.soul.p4")}</p>
            </div>

            <blockquote className="max-w-2xl mx-auto bg-card/80 border-l-4 border-heartbeat p-6 rounded-r-xl italic">
              <p className="font-body text-ink text-lg leading-relaxed">
                {t("about.soul.quote")}
              </p>
            </blockquote>
          </motion.section>

          {/* Visual Roots - with remaining figures */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display text-xl md:text-2xl text-ink text-center">
              {t("about.visual.title")}
            </h3>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              {t("about.visual.text")}
            </p>

            {/* Remaining figures displayed elegantly */}
            <div className="flex flex-wrap justify-center items-end gap-8 md:gap-12 py-8">
              <motion.img 
                src={hartschierleWanderer} 
                alt="Hartschierle - Wanderer with backpack"
                className="h-56 md:h-72 w-auto object-contain drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
              />
              <motion.img 
                src={hartschierleMadonna} 
                alt="Hartschierle - Mother with child"
                className="h-56 md:h-72 w-auto object-contain drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />
            </div>

            <p className="font-body text-sm text-ink/60 text-center">
              <Link to="/hartschierle" className="underline hover:text-heartbeat transition-colors">
                {t("about.visual.link")}
              </Link>
            </p>
          </motion.section>

          {/* Conclusion */}
          <motion.section 
            className="space-y-6 text-center pb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat">
              {t("about.conclusion.title")}
            </h1>
            <div className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4">
              <p>{t("about.conclusion.p1")}</p>
              <p>{t("about.conclusion.p2")}</p>
              <p>{t("about.conclusion.p3")}</p>
            </div>
          <p className="font-display text-2xl text-heartbeat pt-4">
              Hertz an Hertz.
            </p>
          </motion.section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-border/50">
            <Link 
              to="/transparenz" 
              className="font-body text-sm text-ink/50 hover:text-heartbeat transition-colors"
            >
              Impressum & Datenschutz
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
};

export default About;
