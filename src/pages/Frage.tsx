import { useSearchParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

interface Question {
  id: number;
  question: string;
  subtext: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "In welchem Moment unserer Beziehung hast du dich am sichersten bei mir gefühlt?",
    subtext: "Sicherheit ist der Boden, auf dem Liebe wächst."
  },
  {
    id: 2,
    question: "Welche Eigenschaft bewunderst du an mir, sagst es mir aber im Alltag viel zu selten?",
    subtext: "Bewunderung ist der Sauerstoff für den Partner."
  },
  {
    id: 3,
    question: "Welchen gemeinsamen Traum haben wir aus den Augen verloren, den wir unbedingt wiederbeleben sollten?",
    subtext: "Gemeinsame Ziele sind der Kompass."
  },
  {
    id: 4,
    question: "Was könnte ich tun, damit du dich im stressigen Alltag von mir mehr unterstützt fühlst?",
    subtext: "Unterstützung ist Liebe in Aktion."
  },
  {
    id: 5,
    question: "Wann fühlst du dich mir am nächsten – ist es beim Reden, beim Schweigen oder bei Berührung?",
    subtext: "Jeder spricht eine andere Sprache der Liebe."
  },
  {
    id: 6,
    question: "Was brauchst du von mir am meisten, wenn wir uns gestritten haben – erst mal Ruhe oder sofortige Nähe?",
    subtext: "Streitkultur entscheidet über die Dauerhaftigkeit."
  },
  {
    id: 7,
    question: "Wovor hast du in Bezug auf unser gemeinsames Älterwerden am meisten Respekt?",
    subtext: "Ängste zu teilen, macht sie kleiner."
  },
  {
    id: 8,
    question: "In welchem Moment warst du zuletzt richtig stolz darauf, wie wir als Team funktionieren?",
    subtext: "Wir sind mehr als die Summe unserer Teile."
  }
];

const HeartbeatDivider = () => (
  <svg 
    viewBox="0 0 400 48" 
    className="w-full max-w-md h-12 mx-auto my-8"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Left line segment */}
    <path 
      d="M0,24 L80,24 L90,24 L100,8 L110,40 L120,8 L130,40 L140,24 L170,24" 
      fill="none" 
      stroke="hsl(var(--heartbeat))" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Open heart that doesn't touch/close */}
    <path 
      d="M180,24 C180,16 190,10 200,18 C210,10 220,16 220,24 C220,34 200,44 200,44" 
      fill="none" 
      stroke="hsl(var(--heartbeat))" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right line segment */}
    <path 
      d="M230,24 L260,24 L270,24 L280,8 L290,40 L300,8 L310,40 L320,24 L400,24" 
      fill="none" 
      stroke="hsl(var(--heartbeat))" 
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
      
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4">
          <p className="text-center text-sm tracking-widest text-muted-foreground uppercase">
            Hertz an Hertz – Level 2
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <div className="max-w-xl text-center">
            {/* Question */}
            <h1 className="font-display text-2xl md:text-3xl lg:text-4xl leading-relaxed text-foreground mb-6">
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

        {/* Footer CTA */}
        <footer className="pb-12 px-6">
          <div className="text-center">
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-heartbeat text-heartbeat rounded-full text-sm font-medium tracking-wide hover:bg-heartbeat/5 transition-colors"
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
