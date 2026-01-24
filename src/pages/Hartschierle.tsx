import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

// Import historical Hartschierle images
import hartschierleFloetenspieler from "@/assets/hartschierle-floetenspieler.png";
import hartschierleMadonna from "@/assets/hartschierle-madonna.png";
import hartschierleWandererCape from "@/assets/hartschierle-wanderer-cape.png";
import hartschierleWanderer from "@/assets/hartschierle-wanderer.png";

const Hartschierle = () => {
  return (
    <>
      <Helmet>
        <title>Der historische Hartschierle | Hertz an Hertz</title>
        <meta 
          name="description" 
          content="Entdecken Sie die historischen Wurzeln unseres Maskottchens: Der Schramberger Maler Hartschierle aus dem 19. Jahrhundert." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 pt-8">
          <Link 
            to="/about" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Über-uns-Seite
          </Link>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Hero Section */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
              Die historischen Wurzeln: Der echte "Hartschierle"
            </h1>
          </motion.header>

          {/* Introduction */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-foreground leading-relaxed mb-6">
              Während unser Eremit "Großvater Hartschierle" die fiktive Seele unseres Projekts ist, 
              so ist seine visuelle Gestalt tief in der Realität verwurzelt.
            </p>
            <p className="text-foreground leading-relaxed">
              Wir haben uns bewusst entschieden, unsere modernste Technologie (KI und psychologische Analyse) 
              in ein Gewand zu kleiden, das eine 175-jährige Geschichte hat. Wir wollten keine glatte, 
              austauschbare digitale Ästhetik, sondern etwas mit Ecken, Kanten und unverwechselbarem Charakter.
            </p>
          </motion.section>

          {/* First Image */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-16"
          >
            <img 
              src={hartschierleFloetenspieler} 
              alt="Historische Hartschierle-Figur: Flötenspieler im Biedermeier-Stil"
              className="max-w-full h-auto drop-shadow-lg"
            />
          </motion.figure>

          {/* Section: Ein Chronist des Alltags */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-6">
              Ein Chronist des Alltags
            </h2>
            <p className="text-foreground leading-relaxed mb-6">
              Hinter dem Namen und dem einzigartigen Illustrationsstil verbirgt sich eine reale historische 
              Persönlichkeit: Ein Schramberger Maler aus der Mitte des 19. Jahrhunderts, im Volksmund 
              "Hartschierle" genannt.
            </p>
            <p className="text-foreground leading-relaxed">
              Er war kein akademischer Künstler, sondern ein Chronist des einfachen Lebens. Bekannt wurde er 
              für seine naiven, aber unglaublich ausdrucksstarken Papierfiguren im Biedermeier-Stil. Er hielt 
              fest, was er sah: Handwerker, Bauern, Trachten und Szenen des täglichen Miteinanders seiner Zeit.
            </p>
          </motion.section>

          {/* Second Image */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-16"
          >
            <img 
              src={hartschierleMadonna} 
              alt="Historische Hartschierle-Figur: Mutter mit Kind im Biedermeier-Stil"
              className="max-w-full h-auto drop-shadow-lg"
            />
          </motion.figure>

          {/* Section: Warum dieser Stil */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-6">
              Warum dieser Stil für ein modernes Produkt?
            </h2>
            <p className="text-foreground leading-relaxed mb-6">
              In einer Zeit, in der digitale Bilder oft perfekt und glatt sind, hat die Kunst des Hartschierle 
              eine wohltuende Unvollkommenheit. Seine Figuren haben eine geerdete Ehrlichkeit.
            </p>
            <p className="text-foreground leading-relaxed">
              Indem wir seinen Stil nutzen, schlagen wir eine Brücke. Wir verbinden die digitale Zukunft der 
              Beziehungsarbeit mit einer handfesten, lokalen Tradition. Es ist eine Erinnerung daran, dass 
              menschliche Verbindung – genau wie diese handgemalten Figuren – nicht perfekt sein muss, um 
              wertvoll und echt zu sein.
            </p>
          </motion.section>

          {/* Third Image */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-16"
          >
            <img 
              src={hartschierleWanderer} 
              alt="Historische Hartschierle-Figur: Wanderer im Biedermeier-Stil"
              className="max-w-full h-auto drop-shadow-lg"
            />
          </motion.figure>

          {/* Section: Für tiefergehende Recherchen */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl text-primary mb-6">
              Für tiefergehende Recherchen
            </h2>
            <p className="text-foreground leading-relaxed mb-8">
              Die Wiederentdeckung und kunsthistorische Einordnung dieses außergewöhnlichen Malers ist vor 
              allem der Arbeit von Forschern zu verdanken, die sich der Volkskunst widmen.
            </p>
            <p className="text-foreground leading-relaxed mb-8">
              Für alle, die tiefer in die faszinierende Historie dieses Künstlers und seiner Zeit eintauchen 
              möchten, empfehlen wir als grundlegende Quelle den wissenschaftlichen Artikel von Gisela Lixfeld.
            </p>

            {/* Citation Block */}
            <blockquote className="border-l-4 border-primary bg-muted/30 p-6 rounded-r-lg">
              <p className="font-display text-lg text-primary mb-2">
                Wissenschaftliche Referenz
              </p>
              <p className="text-foreground italic">
                Gisela Lixfeld: "Der Schramberger Maler 'Hartschierle' und seine Zeit"
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-3 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Zur wissenschaftlichen Quelle
              </a>
            </blockquote>
          </motion.section>

          {/* Fourth Image - Additional */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-16"
          >
            <img 
              src={hartschierleWandererCape} 
              alt="Historische Hartschierle-Figur: Wanderer mit Umhang im Biedermeier-Stil"
              className="max-w-full h-auto drop-shadow-lg"
            />
          </motion.figure>

          {/* Back to About */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center pt-8 border-t border-border"
          >
            <Link 
              to="/about" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück zur Über-uns-Seite
            </Link>
          </motion.div>

          {/* Footer */}
          <footer className="text-center py-8 mt-8 border-t border-border/50">
            <Link 
              to="/transparenz" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Impressum & Datenschutz
            </Link>
          </footer>
        </main>
      </div>
    </>
  );
};

export default Hartschierle;
