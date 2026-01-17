import { useSearchParams, Link } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Sparkles } from "lucide-react";
import heartsAngel from "@/assets/hearts-angel.png";

interface Question {
  id: number;
  question: string;
  subtext: string;
  science: string;
  sourceTitle: string;
  sourceUrl: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "In welchem Moment unserer Beziehung hast du dich am sichersten bei mir gefühlt?",
    subtext: "Sicherheit ist der Boden, auf dem Liebe wächst.",
    science: "Die Bindungstheorie zeigt: Emotionale Sicherheit ist die Basis. Zu wissen, wann sich der Partner sicher fühlt, stärkt das Fundament.",
    sourceTitle: "Bindungstheorie Basics (Psychology Today)",
    sourceUrl: "https://www.psychologytoday.com/us/basics/attachment"
  },
  {
    id: 2,
    question: "Welche Eigenschaft bewunderst du an mir, sagst es mir aber im Alltag viel zu selten?",
    subtext: "Bewunderung ist der Sauerstoff für den Partner.",
    science: "John Gottman nennt dies das 'System der Zuneigung'. Regelmäßige Wertschätzung ist der stärkste Puffer gegen Konflikte.",
    sourceTitle: "Fondness & Admiration (Gottman)",
    sourceUrl: "https://www.gottman.com/blog/the-fondness-and-admiration-system/"
  },
  {
    id: 3,
    question: "Welchen gemeinsamen Traum haben wir aus den Augen verloren, den wir unbedingt wiederbeleben sollten?",
    subtext: "Gemeinsame Ziele schaffen Sinn über den Alltag hinaus.",
    science: "Paare mit einer gemeinsamen Vision ('Shared Meaning') sind resilienter. Träume sind der Kitt, der die Beziehung zusammenhält.",
    sourceTitle: "Shared Meaning erschaffen (Gottman)",
    sourceUrl: "https://www.gottman.com/blog/create-shared-meaning/"
  },
  {
    id: 4,
    question: "Was könnte ich tun, damit du dich im stressigen Alltag von mir mehr unterstützt fühlst?",
    subtext: "Unterstützung ist Liebe in Aktion.",
    science: "Studien zur 'Partner-Reagibilität' zeigen: Nichts senkt Stress so effektiv wie das Gefühl, dass der Partner die Lasten sieht.",
    sourceTitle: "The Science of Support (Greater Good)",
    sourceUrl: "https://greatergood.berkeley.edu/article/item/how_to_be_a_supportive_spouse"
  },
  {
    id: 5,
    question: "Wann fühlst du dich mir am nächsten – ist es beim Reden, beim Schweigen oder bei Berührung?",
    subtext: "Jeder spricht eine andere Sprache der Liebe.",
    science: "Missverständnisse entstehen, wenn wir Zuneigung so zeigen, wie wir sie selbst brauchen, statt wie der Partner sie empfängt.",
    sourceTitle: "Die 5 Sprachen der Liebe (Verlags-Info)",
    sourceUrl: "https://www.5lovelanguages.com/learn"
  },
  {
    id: 6,
    question: "Was brauchst du von mir am meisten, wenn wir uns gestritten haben – erst mal Ruhe oder sofortige Nähe?",
    subtext: "Streitkultur entscheidet über die Dauerhaftigkeit.",
    science: "Das 'Forderungs-Rückzugs-Muster' zerstört Beziehungen. Zu wissen, wer Raum und wer Nähe braucht, verhindert Eskalation.",
    sourceTitle: "Demand-Withdraw Pattern (Psychology Today)",
    sourceUrl: "https://www.psychologytoday.com/intl/blog/resolution-not-conflict/201210/the-demand-withdraw-pattern-in-relationships"
  },
  {
    id: 7,
    question: "Wovor hast du in Bezug auf unser gemeinsames Älterwerden am meisten Respekt?",
    subtext: "Ängste zu teilen, macht sie kleiner.",
    science: "Verletzlichkeit ist der direkteste Weg zur Verbindung. Sie signalisiert Vertrauen und ermöglicht dem Partner, Fürsorge zu zeigen.",
    sourceTitle: "The Power of Vulnerability (Brené Brown)",
    sourceUrl: "https://brenebrown.com/podcast/the-power-of-vulnerability/"
  },
  {
    id: 8,
    question: "In welchem Moment warst du zuletzt richtig stolz darauf, wie wir als Team funktionieren?",
    subtext: "Wir sind mehr als die Summe unserer Teile.",
    science: "Das Bewusstsein für 'Collective Efficacy' (gemeinsame Wirksamkeit) stärkt die Identität als Paar massiv.",
    sourceTitle: "The Power of We (Psychology Today)",
    sourceUrl: "https://www.psychologytoday.com/us/blog/meet-catch-and-keep/202302/the-power-of-we-in-relationships"
  },
  {
    id: 9,
    question: "Hast du manchmal das Gefühl, dass die Verantwortung für unseren Alltag ungerecht verteilt ist?",
    subtext: "Unsichtbare Arbeit sichtbar machen.",
    science: "'Mental Load' ist die unsichtbare Planungsarbeit, die oft belastender ist als die Ausführung. Darüber zu sprechen, schafft Entlastung.",
    sourceTitle: "Was ist Mental Load? (Equal Care Day)",
    sourceUrl: "https://equalcareday.org/mental-load/"
  },
  {
    id: 10,
    question: "Haben wir im 'Erwachsen-Sein' verlernt, einfach nur albern miteinander zu sein?",
    subtext: "Spielen hält die Liebe jung.",
    science: "Verspieltheit ('Playfulness') korreliert direkt mit Beziehungszufriedenheit. Gemeinsames Lachen baut Stresshormone sofort ab.",
    sourceTitle: "Playfulness in Relationships (Psychology Today)",
    sourceUrl: "https://www.psychologytoday.com/us/blog/everyone-on-top/202312/how-playfulness-can-transform-your-love-life"
  },
  {
    id: 11,
    question: "Welches Beziehungsmuster deiner Eltern möchtest du in unserer Partnerschaft auf keinen Fall wiederholen?",
    subtext: "Prägungen erkennen ist der erste Schritt zur Freiheit.",
    science: "Wir wiederholen oft unbewusst, was wir vorgelebt bekamen ('Intergenerationale Weitergabe'). Bewusstheit ist der erste Schritt zur Änderung.",
    sourceTitle: "Breaking Family Patterns (PsychWeb)",
    sourceUrl: "https://www.psychologytoday.com/us/blog/the-regret-free-life/202501/breaking-the-cycle-of-generational-trauma"
  },
  {
    id: 12,
    question: "Welche Angst in Bezug auf Geld oder Sicherheit hast du, die ich vielleicht gar nicht kenne?",
    subtext: "Geld ist selten nur Geld – es sind Werte.",
    science: "Geldkonflikte sind selten mathematisch, sondern fast immer Wertekonflikte (Freiheit vs. Sicherheit). Das 'Warum' ist wichtiger als der Betrag.",
    sourceTitle: "Money & Relationships (APA)",
    sourceUrl: "https://www.apa.org/topics/money/conflict"
  },
  {
    id: 13,
    question: "Haben wir im Trubel der Liebe vergessen, einfach nur 'beste Freunde' zu sein?",
    subtext: "Freundschaft ist das Fundament.",
    science: "Eine tiefe Freundschaft ist laut Dr. Gottman das Fundament der Beziehung ('Sound Relationship House'). Leidenschaft braucht Freundschaft.",
    sourceTitle: "The Sound Relationship House (Gottman)",
    sourceUrl: "https://www.gottman.com/blog/the-sound-relationship-house-build-love-maps/"
  },
  {
    id: 14,
    question: "Gibt es eine alte Verletzung, die du zwar verziehen, aber noch nicht vergessen hast?",
    subtext: "Verzeihen heißt nicht vergessen.",
    science: "Der 'Zeigarnik-Effekt' besagt: Wir erinnern uns besser an Unerledigtes. Aussprechen hilft dem Gehirn, das emotionale Kapitel wirklich zu schließen.",
    sourceTitle: "Zeigarnik Effect (GoodTherapy)",
    sourceUrl: "https://www.goodtherapy.org/blog/psychpedia/zeigarnik-effect"
  },
  {
    id: 15,
    question: "In welchem Bereich habe ich mich so verändert, dass du mich manchmal neu kennenlernen musst?",
    subtext: "Wachstum braucht Neugier.",
    science: "Das 'Michelangelo-Phänomen': Glückliche Partner 'meißeln' sich gegenseitig positiv und unterstützen das persönliche Wachstum des anderen.",
    sourceTitle: "The Michelangelo Phenomenon (ScienceDirect)",
    sourceUrl: "https://www.sciencedirect.com/topics/psychology/michelangelo-phenomenon"
  },
  {
    id: 16,
    question: "Fühlst du dich manchmal einsam, obwohl ich im selben Raum bin?",
    subtext: "Anwesenheit ist nicht gleich Verbundenheit.",
    science: "Einsamkeit zu zweit entsteht durch fehlende emotionale Abstimmung ('Attunement'). Das Gefühl zu benennen, ist der Weg zurück in die Verbindung.",
    sourceTitle: "Emotional Attunement (Gottman)",
    sourceUrl: "https://www.gottman.com/blog/emotional-attunement-creates-safety/"
  }
];

const HeartbeatPattern = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="heartbeat-pattern" x="0" y="0" width="200" height="60" patternUnits="userSpaceOnUse">
          <path 
            d="M0,30 L40,30 L50,30 L55,15 L60,45 L65,15 L70,45 L75,30 L100,30 L140,30 L150,30 L155,15 L160,45 L165,15 L170,45 L175,30 L200,30" 
            fill="none" 
            stroke="#C00000" 
            strokeWidth="0.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.04"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#heartbeat-pattern)" />
    </svg>
  </div>
);

const HeartbeatDivider = () => (
  <svg 
    viewBox="0 0 400 48" 
    className="w-full max-w-md h-12 mx-auto my-6"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Left line segment */}
    <path 
      d="M0,24 L80,24 L90,24 L100,8 L110,40 L120,8 L130,40 L140,24 L170,24" 
      fill="none" 
      stroke="#C00000" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Open heart that doesn't touch/close */}
    <path 
      d="M180,24 C180,16 190,10 200,18 C210,10 220,16 220,24 C220,34 200,44 200,44" 
      fill="none" 
      stroke="#C00000" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right line segment */}
    <path 
      d="M230,24 L260,24 L270,24 L280,8 L290,40 L300,8 L310,40 L320,24 L400,24" 
      fill="none" 
      stroke="#C00000" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Safe IDs for roulette rotation (includes all valid question IDs)
const SAFE_IDS = [1, 2, 3, 4, 5, 8, 10, 13, 15];

const Frage = () => {
  const [searchParams] = useSearchParams();
  
  // Roulette-Logik: Bei id=2 auf zufällige Safe-ID weiterleiten
  useEffect(() => {
    const idParam = searchParams.get("id");
    const hasRedirected = sessionStorage.getItem("roulette_redirect");
    
    if (idParam === "2" && !hasRedirected) {
      const randomId = SAFE_IDS[Math.floor(Math.random() * SAFE_IDS.length)];
      sessionStorage.setItem("roulette_redirect", "true");
      window.location.replace(`/frage?id=${randomId}`);
    } else {
      sessionStorage.removeItem("roulette_redirect");
    }
  }, [searchParams]);
  
  const currentQuestion = useMemo(() => {
    const idParam = searchParams.get("id");
    
    if (idParam) {
      const id = parseInt(idParam, 10);
      const found = questions.find(q => q.id === id);
      if (found) return found;
    }
    
    // Fallback: random question from SAFE_IDS
    const randomId = SAFE_IDS[Math.floor(Math.random() * SAFE_IDS.length)];
    const found = questions.find(q => q.id === randomId);
    return found || questions[0];
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Hertz an Hertz – Level 2</title>
        <meta name="description" content="Die tiefe Frage zu deiner Karte" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: '#FDF8F3' }}>
        {/* Subtle heartbeat pattern overlay */}
        <HeartbeatPattern />
        
        {/* Angel Image - The Messenger */}
        <div className="pt-8 pb-4 flex justify-center relative z-10">
          <img 
            src={heartsAngel} 
            alt="Der Engel – Bote der tiefen Fragen" 
            className="h-32 md:h-36 lg:h-40 w-auto object-contain"
          />
        </div>

        {/* Header */}
        <header className="pb-6 relative z-10">
          <p className="text-center text-xs tracking-[0.3em] uppercase text-muted-foreground">
            HERTZ AN HERTZ – LEVEL 2
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8 relative z-10">
          <div className="max-w-xl text-center">
            {/* Question */}
            <h1 
              className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-4 text-foreground"
            >
              „{currentQuestion.question}"
            </h1>
            
            {/* Heartbeat Divider */}
            <HeartbeatDivider />
            
            {/* Subtext */}
            <p className="text-base md:text-lg italic text-muted-foreground">
              {currentQuestion.subtext}
            </p>
          </div>
        </main>

        {/* Science Section - Premium Card Look */}
        <section className="px-6 pb-8 relative z-10">
          <div 
            className="max-w-xl mx-auto p-6 rounded-lg shadow-card"
            style={{ 
              backgroundColor: '#FFFDF9',
              borderLeft: '4px solid hsl(var(--primary))',
              border: '1px solid hsl(var(--border))',
              borderLeftWidth: '4px',
              borderLeftColor: 'hsl(var(--primary))'
            }}
          >
            <h2 className="text-xs tracking-[0.2em] uppercase mb-3 font-medium text-primary">
              Wissenschaftlicher Impuls
            </h2>
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground mb-4">
              {currentQuestion.science}
            </p>
            
            {/* Source Link */}
            <a 
              href={currentQuestion.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: '#4B5563' }}
            >
              <span className="underline underline-offset-2">{currentQuestion.sourceTitle}</span>
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
            </a>
          </div>
        </section>


        {/* Footer CTA - Fügung Block */}
        <footer className="pb-12 px-6 relative z-10">
          <div className="max-w-xl mx-auto flex flex-col items-center">
            {/* Fügung Headline */}
            <h3 className="font-display text-2xl md:text-3xl text-primary mb-3 text-center">
              Vielleicht war es Fügung...
            </h3>
            <p className="text-muted-foreground text-sm md:text-base text-center mb-6 max-w-md leading-relaxed">
              ...dass Ihr genau jetzt hier seid. Doch jede Beziehung schwingt anders. Damit die Fragen nicht "irgendwen", sondern <em>Euch</em> im Herzen treffen, brauchen wir ein kurzes Stimmungsbild. Eicht hier die Frequenz auf Eure aktuelle Situation:
            </p>

            {/* Primary CTA Button - Glowing Gradient - Links to tuner section */}
            <Link 
              to="/#tuner"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium text-white transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mb-8"
              style={{
                background: 'linear-gradient(135deg, #C00000 0%, #8B0000 50%, #C00000 100%)',
                boxShadow: '0 4px 24px -4px rgba(192, 0, 0, 0.4)',
              }}
            >
              <Sparkles className="w-5 h-5" />
              <span>4 persönliche Karten erstellen</span>
            </Link>

          </div>
        </footer>
      </div>
    </>
  );
};

export default Frage;
