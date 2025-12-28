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
  const { language } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Über Hertz an Hertz - Wissenschaft trifft Herzschlag</title>
        <meta name="description" content="Erfahren Sie mehr über die Philosophie hinter Hertz an Hertz: Wo Wissenschaft auf Herzschlag trifft und Technologie auf Tradition." />
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
              Über Hertz an Hertz
            </motion.h1>
            <motion.h2 
              className="font-body text-xl md:text-2xl text-ink/80 italic max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Wo Wissenschaft auf Herzschlag trifft – und Technologie auf Tradition.
            </motion.h2>
            <motion.div 
              className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4"
              variants={fadeInUp}
            >
              <p>
                Willkommen bei Hertz an Hertz. Wir glauben, dass Liebe mehr ist als nur ein flüchtiges Gefühl. 
                Sie ist eine Physik – eine Schwingung, die gepflegt werden will.
              </p>
              <p>
                Unsere Philosophie basiert auf einer faszinierenden Entdeckung des Physikers Christiaan Huygens 
                aus dem Jahr 1665: Er bemerkte, dass zwei Pendeluhren, die am selben Holzbalken hängen, ihre 
                Schwingungen mit der Zeit ganz von selbst aneinander anpassen. Er nannte dieses Phänomen <em>Synchronisation</em>.
              </p>
              <p>
                In einer Beziehung seid ihr diese beiden Uhren. Und Hertz an Hertz ist der Resonanzboden, 
                der euch verbindet und dabei hilft, euren gemeinsamen Takt zu finden.
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
              alt="Hartschierle - Mann mit Umhang"
              className="h-48 md:h-64 w-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Rat der Weisen */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat text-center">
              Der "Rat der Weisen": Unsere globale DNA
            </h1>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              Dieses Kartendeck ist kein Zufallsprodukt. Es ist das Ergebnis einer tiefen Analyse der weltweit 
              führenden Beziehungsexperten. Unsere Künstliche Intelligenz wurde nicht mit simplen Kalendersprüchen 
              trainiert, sondern mit den "Gold-Standards" der modernen Paartherapie – sowohl international als auch lokal.
            </p>
            <p className="font-body text-ink/80 text-center italic">
              Jede Karte, die du in der Hand hältst, basiert auf den Prinzipien dieser Vordenker:
            </p>

            {/* Internationale Pioniere */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink border-b border-border pb-2">
                Die internationalen Pioniere
              </h3>
              <ul className="space-y-6">
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Drs. John & Julie Gottman</strong> (The Seven Principles for Making Marriage Work): 
                  Die Architekten des berühmten "Love Lab". Von ihnen stammt das Konzept der "Love Maps". 
                  Unsere Fragen helfen euch, diese inneren Landkarten des Partners ständig zu aktualisieren, 
                  denn wir wissen: Man kann nur tief lieben, was man wirklich kennt.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Esther Perel</strong> (Wild und Weise / Mating in Captivity): 
                  Sie erforscht das ewige Spannungsfeld zwischen Sicherheit und Abenteuer. Ihre Weisheit fließt 
                  in unsere tiefgründigen Fragen ein, um das Geheimnisvolle in eurer Beziehung zu bewahren 
                  und nicht alles in Routine ersticken zu lassen.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Dr. Sue Johnson</strong> (Halt mich fest / Hold Me Tight): 
                  Die Begründerin der Emotionsfokussierten Therapie (EFT). Ihre Arbeit lehrt uns, dass hinter 
                  fast jedem Streit die eine bange Frage steckt: "Bist du wirklich für mich da?" Unsere Karten 
                  schaffen den sicheren Raum, um diese Frage miteinander zu beantworten.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Terry Real</strong> (The New Rules of Marriage): 
                  Er prägte das moderne "Wir-Bewusstsein". Seine Strategien helfen uns, vom egozentrischen 
                  Kampf in eine kollaborative Partnerschaft zu wechseln – ein Team zu werden.
                </li>
              </ul>
            </div>

            {/* Deutschsprachige Experten */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink border-b border-border pb-2">
                Die deutschsprachigen Experten
              </h3>
              <ul className="space-y-6">
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Stefanie Stahl</strong> (Das Kind in dir muss Heimat finden): 
                  Essenziell für die Arbeit mit dem "Inneren Kind". Unsere Impulse helfen zu unterscheiden: 
                  Spricht hier gerade mein erwachsenes Ich oder eine alte Verletzung aus der Vergangenheit?
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Michael Mary</strong> (Die 5 Lügen der Liebe): 
                  Unser Anker für den gesunden Realismus. Er lehrt uns, dass Erwartungen verhandelbar sind 
                  und Konflikte nicht das Ende bedeuten. Das nimmt den Druck raus.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Oskar Holzberg</strong> (Schlüsselsätze der Liebe): 
                  Der Meister des Alltags. Seine Beobachtungen fließen in unsere Mikro-Rituale ein, 
                  damit die Liebe auch zwischen Abwasch, Jobstress und Kindererziehung überlebt.
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Technologie Section */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat text-center">
              Die Technologie: Eure Geschichte in sicheren Händen
            </h1>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              Hier trifft moderne Analyse auf menschliches Bedürfnis. Unsere Künstliche Intelligenz nutzt 
              diese geballte Expertise als flexiblen Baukasten, um die passenden Impulse für euch zu finden. 
              Doch wir wissen: Technologie – gerade KI – kann einschüchternd wirken. Deshalb gilt bei uns 
              das Prinzip der absoluten Hoheit über eure Daten.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Card 1 */}
              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  1. Funktioniert auch ohne Seelenstriptease
                </h3>
                <p className="font-body text-ink/70 text-sm leading-relaxed">
                  Ihr müsst der KI nichts über euch erzählen, wenn ihr nicht wollt. Auch ohne spezifisches 
                  Wissen über eure persönliche Situation generiert das System wunderbare Impulse. Warum? 
                  Weil die universellen Prinzipien von Gottman, Perel oder Stahl so stark sind, dass sie jede Beziehung bereichern.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  2. Der Turbo: Maßgeschneidert
                </h3>
                <p className="font-body text-ink/70 text-sm leading-relaxed">
                  Wenn ihr euch jedoch entscheidet, der KI Kontext zu geben (z.B. "Wir sind gerade Eltern geworden" 
                  oder "Wir bewältigen einen Verlust"), kann sie die Fragen präzisieren. Statt generischer Ratschläge 
                  erhaltet ihr dann Impulse, die genau dort ansetzen, wo ihr gerade steht.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  3. Unser Sicherheits-Versprechen
                </h3>
                <div className="font-body text-ink/70 text-sm leading-relaxed space-y-2">
                  <p className="font-semibold text-ink">Eure Privatsphäre ist unser höchstes Gut.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Kein KI-Training:</strong> Keine eurer Eingaben wird benutzt, um die KI zu trainieren.</li>
                    <li><strong>DSGVO-Konformität:</strong> Wir halten uns strikt an die Datenschutz-Grundverordnung.</li>
                    <li><strong>Datensparsamkeit:</strong> Eure Informationen werden nur dann sicher verschlüsselt aufbewahrt, wenn ihr das ausdrücklich wünscht.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Großvater Hartschierle */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat text-center">
              Die Seele: Großvater Hartschierles Vermächtnis
            </h1>

            {/* Hermit figure - quiet, contemplative */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={hartschierleFloetenspieler} 
                alt="Hartschierle - Flötenspieler am Baum"
                className="h-56 md:h-72 w-auto object-contain drop-shadow-lg"
              />
            </motion.div>

            <div className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4 text-center">
              <p>
                Doch Wissenschaft, Daten und Algorithmen sind oft laut und schnell. 
                Manchmal braucht die Liebe das genaue Gegenteil: Stille, Langsamkeit und Demut.
              </p>
              <p className="font-semibold text-ink">
                Dürfen wir vorstellen: Großvater Hartschierle.
              </p>
              <p>
                Er war beileibe kein Beziehungsexperte im klassischen Sinne. Im Gegenteil: Er mied den Trubel 
                der Menschen. Er zog sich als Eremit in die Einsamkeit einer Höhle tief im Wald zurück, um dort 
                Antworten zu finden, die im Lärm des Alltags untergehen.
              </p>
              <p>
                Er war ein Beobachter, der seine Weisheit nicht aus Büchern, sondern aus dem Rauschen der Wipfel, 
                dem Moos auf den Steinen und dem ewigen Kreislauf der Natur schöpfte. Er lehrte uns, dass Antworten 
                oft nicht im hektischen Austausch liegen, sondern im gemeinsamen Aushalten der Stille.
              </p>
              <p>
                In Hertz an Hertz ist er der ruhende Pol. Er fordert euch nicht zum Reden auf, sondern dazu, 
                einfach nur da zu sein. Seine Karten sind Einladungen zur Ruhe:
              </p>
            </div>

            {/* Quote Block */}
            <blockquote className="max-w-2xl mx-auto bg-card/80 border-l-4 border-heartbeat p-6 rounded-r-xl italic">
              <p className="font-body text-ink text-lg leading-relaxed">
                "Hör auf den Wald. In der Stille klären sich die Gedanken – und darin hörst du endlich 
                auch wieder das Herz des Anderen schlagen."
              </p>
            </blockquote>
          </motion.section>

          {/* Visuelle Wurzeln - with remaining figures */}
          <motion.section 
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-display text-xl md:text-2xl text-ink text-center">
              Die visuellen Wurzeln: Der echte Maler "Hartschierle"
            </h3>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              Die visuelle Seele unseres Projekts basiert auf dem einzigartigen Stil eines realen Schramberger 
              Malers aus dem 19. Jahrhundert, dem echten "Hartschierle". Wir nutzen seine naive, aber charakterstarke 
              Kunst, um der modernen Technik tiefe, regionale Wurzeln zu geben.
            </p>

            {/* Remaining figures displayed elegantly */}
            <div className="flex flex-wrap justify-center items-end gap-8 md:gap-12 py-8">
              <motion.img 
                src={hartschierleWanderer} 
                alt="Hartschierle - Wanderer mit Rucksack"
                className="h-56 md:h-72 w-auto object-contain drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
              />
              <motion.img 
                src={hartschierleMadonna} 
                alt="Hartschierle - Mutter mit Kind"
                className="h-56 md:h-72 w-auto object-contain drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              />
            </div>

            <p className="font-body text-sm text-ink/60 text-center">
              <Link to="/hartschierle" className="underline hover:text-heartbeat transition-colors">
                Mehr zur wahren Geschichte hinter den Bildern erfahren →
              </Link>
            </p>
          </motion.section>

          {/* Abschluss */}
          <motion.section 
            className="space-y-6 text-center pb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat">
              Eure Säule für eine lebendige Beziehung
            </h1>
            <div className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4">
              <p>
                Synchronisation bedeutet nicht, dass ihr immer im perfekten Gleichschritt marschieren müsst.
              </p>
              <p>
                Es geht darum, nach Dissonanzen immer wieder zueinander zu finden. Es geht um Mechanismen, 
                die euch helfen, die Herausforderungen des Lebens aufzufangen und wieder in Resonanz zu kommen. 
                Hertz an Hertz möchte eine der tragenden Säulen sein, die euch dabei unterstützt.
              </p>
              <p>
                Findet euren Rhythmus. Damit das entsteht, wonach wir uns alle sehnen: Eine Liebe, die wächst und gedeiht.
              </p>
            </div>
            <p className="font-display text-2xl text-heartbeat pt-4">
              Hertz an Hertz.
            </p>
          </motion.section>
        </main>
      </div>
    </>
  );
};

export default About;
