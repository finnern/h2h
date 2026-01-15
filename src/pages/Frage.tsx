import { useSearchParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

interface Question {
  id: number;
  question: string;
  subtext: string;
  science: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "In welchem Moment unserer Beziehung hast du dich am sichersten bei mir gefühlt?",
    subtext: "Sicherheit ist der Boden, auf dem Liebe wächst.",
    science: "Die Bindungstheorie zeigt: Das Gefühl emotionaler Sicherheit ist die Grundvoraussetzung für Nähe und Exploration in einer Partnerschaft. Zu wissen, wann sich der Partner sicher fühlt, ist der Schlüssel zur Stärkung dieser Basis."
  },
  {
    id: 2,
    question: "Welche Eigenschaft bewunderst du an mir, sagst es mir aber im Alltag viel zu selten?",
    subtext: "Bewunderung ist der Sauerstoff für den Partner.",
    science: "Beziehungsforscher John Gottman nennt dies das 'System der Zuneigung und Bewunderung'. Regelmäßig ausgesprochene Wertschätzung ist der stärkste Puffer gegen Konflikte und Verachtung."
  },
  {
    id: 3,
    question: "Welchen gemeinsamen Traum haben wir aus den Augen verloren, den wir unbedingt wiederbeleben sollten?",
    subtext: "Gemeinsame Ziele schaffen ein 'Wir-Gefühl' und Sinn über den Alltag hinaus.",
    science: "Paare, die eine gemeinsame Vision für ihre Zukunft haben ('Shared Meaning'), erleben eine tiefere Verbindung und Resilienz in Krisenzeiten. Träume sind der Kitt, der die Beziehung zusammenhält."
  },
  {
    id: 4,
    question: "Was könnte ich tun, damit du dich im stressigen Alltag von mir mehr unterstützt fühlst?",
    subtext: "Unterstützung ist Liebe in Aktion.",
    science: "Studien zur 'wahrgenommenen Partner-Reagibilität' zeigen: Nichts senkt das Stresslevel so effektiv wie das Gefühl, dass der Partner die eigenen Lasten sieht und mitträgt."
  },
  {
    id: 5,
    question: "Wann fühlst du dich mir am nächsten – ist es beim Reden, beim Schweigen oder bei Berührung?",
    subtext: "Jeder spricht eine andere Sprache der Liebe.",
    science: "Missverständnisse entstehen oft, weil wir Zuneigung so zeigen, wie wir sie selbst gerne empfangen, nicht wie der Partner sie braucht. Das Verständnis der 'Liebessprache' des anderen ist essenziell für echte Intimität."
  },
  {
    id: 6,
    question: "Was brauchst du von mir am meisten, wenn wir uns gestritten haben – erst mal Ruhe oder sofortige Nähe?",
    subtext: "Streitkultur entscheidet über die Dauerhaftigkeit der Beziehung.",
    science: "In Konflikten geraten Partner oft in ein 'Forderungs-Rückzugs-Muster'. Zu wissen, ob der andere Raum zur Selbstregulation oder Nähe zur Co-Regulation braucht, verhindert Eskalationen."
  },
  {
    id: 7,
    question: "Wovor hast du in Bezug auf unser gemeinsames Älterwerden am meisten Respekt?",
    subtext: "Ängste zu teilen, macht sie kleiner.",
    science: "Das Teilen von Verletzlichkeit ist der direkteste Weg zu tiefer emotionaler Verbindung. Es signalisiert Vertrauen und ermöglicht dem Partner, Fürsorge zu zeigen."
  },
  {
    id: 8,
    question: "In welchem Moment warst du zuletzt richtig stolz darauf, wie wir als Team funktionieren?",
    subtext: "Wir sind mehr als die Summe unserer Teile.",
    science: "Das Bewusstsein für die gemeinsame Wirksamkeit ('Collective Efficacy') stärkt die Identität als Paar. Der Stolz auf das 'Wir' ist ein starker Schutzfaktor in herausfordernden Zeiten."
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

const Frage = () => {
  const [searchParams] = useSearchParams();
  
  const currentQuestion = useMemo(() => {
    const idParam = searchParams.get("id");
    
    if (idParam) {
      const id = parseInt(idParam, 10);
      const found = questions.find(q => q.id === id);
      if (found) return found;
    }
    
    // Fallback: random question
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
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
        
        {/* Header */}
        <header className="pt-8 pb-4 relative z-10">
          <p className="text-center text-xs tracking-[0.3em] uppercase" style={{ color: '#6B7280' }}>
            HERTZ AN HERTZ – LEVEL 2
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8 relative z-10">
          <div className="max-w-xl text-center">
            {/* Question */}
            <h1 
              className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-4"
              style={{ color: '#374151' }}
            >
              „{currentQuestion.question}"
            </h1>
            
            {/* Heartbeat Divider */}
            <HeartbeatDivider />
            
            {/* Subtext */}
            <p 
              className="text-base md:text-lg italic"
              style={{ color: '#6B7280' }}
            >
              {currentQuestion.subtext}
            </p>
          </div>
        </main>

        {/* Science Section */}
        <section className="px-6 pb-8 relative z-10">
          <div 
            className="max-w-xl mx-auto p-6 rounded-sm"
            style={{ 
              backgroundColor: '#F5F0EB',
              borderLeft: '3px solid #C00000'
            }}
          >
            <h2 
              className="text-xs tracking-[0.2em] uppercase mb-3 font-medium"
              style={{ color: '#C00000' }}
            >
              Wissenschaftlicher Impuls
            </h2>
            <p 
              className="text-sm md:text-base leading-relaxed"
              style={{ color: '#4B5563' }}
            >
              {currentQuestion.science}
            </p>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="pb-12 px-6 relative z-10">
          <div className="text-center">
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all hover:opacity-90 hover:shadow-lg"
              style={{ 
                backgroundColor: '#C00000',
                color: '#FFFFFF'
              }}
            >
              Zur Startseite
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Frage;
