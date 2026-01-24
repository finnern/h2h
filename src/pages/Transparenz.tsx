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

        <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <motion.article
            className="prose prose-lg dark:prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl md:text-4xl text-heartbeat mb-2">
              Transparenz & Vertrauen
            </h1>
            <p className="text-muted-foreground italic mb-8">
               Impressum & Datenschutzerklärung (Stand: Operation Valentin)
            </p>

            {/* PREAMBLE */}
            <div className="bg-card/50 rounded-xl p-6 border border-border mb-8 italic text-foreground">
               "Bei Hertz an Hertz geht es um das Wertvollste, das wir haben: Echte Verbindung. 
               Um diese zu erzeugen, vertraust du uns Einblicke an. Wir behandeln diese nicht als Datensätze, 
               sondern als Geheimnisse unter Freunden."
            </div>

            <section className="space-y-8">
              
              {/* IMPRESSUM CARD */}
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-sm">
                <h2 className="font-display text-2xl text-foreground mb-6 border-b border-border pb-2">
                    I. Wer den Takt angibt (Impressum)
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8 font-body text-muted-foreground">
                    <div>
                        <h3 className="font-bold text-foreground mb-2">Angaben gemäß § 5 TMG</h3>
                        <p>
                        Finnern Innovation Consulting<br />
                        Mark Finnern<br />
                        Gewerbepark Majolika<br />
                        Schiltachstrasse 38<br />
                        78713 Schramberg<br />
                        Deutschland
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground mb-2">Kontakt & Draht</h3>
                        <p>
                        E-Mail: <a href="mailto:mark@finnern.com" className="hover:text-heartbeat transition-colors">mark@finnern.com</a><br />
                        Telefon: +49 (0)170 668 8388<br />
                        Web: hertzanhertz.de
                        </p>
                        
                        <h3 className="font-bold text-foreground mb-2 mt-4">Verantwortlich (V.i.S.d.P.)</h3>
                        <p>Mark Finnern (Anschrift wie links)</p>
                    </div>
                </div>
                <div className="mt-6 text-sm text-muted-foreground pt-4 border-t border-border">
                    <strong>Streitschlichtung:</strong> Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Wir lösen Probleme lieber direkt.
                </div>
              </div>

              {/* DATENSCHUTZ CARD */}
              <div className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-sm">
                <h2 className="font-display text-2xl text-foreground mb-6 border-b border-border pb-2">
                    II. Deine Geheimnisse, unser Tresor (Datenschutz)
                </h2>
                
                <div className="space-y-6 font-body text-muted-foreground">
                    
                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">1. Der Geist der Datenverarbeitung</h3>
                        <p>
                            Anders als auf vielen Webseiten sind deine Daten hier keine Währung für Werbung. Sie sind der <strong>Rohstoff für Poesie</strong>. 
                            Wir erfassen Informationen (Namen, Eigenschaften, Anekdoten) ausschließlich zu einem Zweck: Um daraus ein einzigartiges, 
                            auf dich zugeschnittenes Kartenspiel zu generieren. Sobald die "Operation Valentin" abgeschlossen ist, erlischt der Zweck.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">2. Wer passt auf die Daten auf?</h3>
                        <p>Verantwortlich ist der Architekt des Ganzen: Mark Finnern (siehe Impressum).</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">3. Was wir erfassen (Die "Resonanz-Engine")</h3>
                        <ul className="list-disc pl-5 space-y-2 mt-2">
                            <li>
                                <strong>Das technische Fundament (Hosting):</strong> Unsere Seite läuft über Lovable und GitHub Pages (USA). 
                                Automatisch erfasst werden dabei rein technische Daten (Server-Log-Files: IP, Browser, Zeit), damit die Seite sicher läuft.
                            </li>
                            <li>
                                <strong>Der Herzschlag (Dein Input):</strong> Wenn du unser Formular "Schenkt Resonanz" nutzt, gibst du aktiv Daten ein 
                                (Namen, Beziehungsstatus, Stimmungen). Diese Daten werden <strong>nicht</strong> automatisch gespeichert, solange du nur surfst. 
                                Sie werden erst verarbeitet, wenn du auf "Generieren" klickst.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h3 className="text-lg font-bold text-heartbeat mb-2">4. Die Alchemie (KI-Verarbeitung)</h3>
                        <p className="mb-2">Dies ist das Herzstück. Damit aus deinen Worten ein Spiel wird, nutzen wir moderne Schnittstellen:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><strong>Transport:</strong> Deine Eingaben werden an unseren Workflow-Server (<strong>n8n</strong>, EU/Deutschland) gesendet.</li>
                            <li><strong>Veredelung:</strong> Wir senden anonymisierte Prompts an die API von <strong>OpenAI</strong> (USA). 
                            <em>Wichtig:</em> Wir nutzen Einstellungen, die verhindern, dass deine Daten zum Training der KI-Modelle verwendet werden.</li>
                            <li><strong>Output:</strong> Das Ergebnis ist dein PDF-Unikat.</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">5. Speicher-Logistik</h3>
                        <p>
                            Wir speichern das generierte PDF und die Bestelldaten bis zum Abschluss der "Operation Valentin" (Versand & Bestätigung). 
                            Danach werden sensible Inhalts-Daten gelöscht, sofern keine steuerrechtlichen Aufbewahrungsfristen greifen.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">6. Deine Hoheitsrechte</h3>
                        <p>
                            Du bleibst Herr deiner Daten. Du hast jederzeit das Recht auf Auskunft, Löschung oder Widerruf. 
                            Ein kurzer Zuruf an <a href="mailto:mark@finnern.com" className="text-foreground underline hover:text-heartbeat">mark@finnern.com</a> genügt.
                        </p>
                    </div>

                </div>
              </div>
            </section>
          </motion.article>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border mt-8">
          <div className="text-center">
            <Link to="/">
              <p className="font-display text-xl text-heartbeat hover:opacity-80 transition-opacity">
                Hertz an Hertz
              </p>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">© {new Date().getFullYear()} Finnern Innovation Consulting</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Transparenz;
