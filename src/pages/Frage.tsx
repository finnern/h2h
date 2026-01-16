import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Sparkles, Loader2 } from "lucide-react";
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
    sourceTitle: "Mehr zur Bindungstheorie (Psychology Today)",
    sourceUrl: "https://www.psychologytoday.com/us/basics/attachment"
  },
  {
    id: 2,
    question: "Welche Eigenschaft bewunderst du an mir, sagst es mir aber im Alltag viel zu selten?",
    subtext: "Bewunderung ist der Sauerstoff für den Partner.",
    science: "John Gottman nennt dies das 'System der Zuneigung'. Regelmäßige Wertschätzung ist der stärkste Puffer gegen Konflikte.",
    sourceTitle: "Das Fondness & Admiration System (Gottman)",
    sourceUrl: "https://www.gottman.com/blog/the-fondness-and-admiration-system/"
  },
  {
    id: 3,
    question: "Welchen gemeinsamen Traum haben wir aus den Augen verloren, den wir unbedingt wiederbeleben sollten?",
    subtext: "Gemeinsame Ziele schaffen Sinn über den Alltag hinaus.",
    science: "Paare mit einer gemeinsamen Vision ('Shared Meaning') sind resilienter. Träume sind der Kitt, der die Beziehung zusammenhält.",
    sourceTitle: "Shared Meaning erschaffen (Gottman Blog)",
    sourceUrl: "https://www.gottman.com/blog/create-shared-meaning/"
  },
  {
    id: 4,
    question: "Was könnte ich tun, damit du dich im stressigen Alltag von mir mehr unterstützt fühlst?",
    subtext: "Unterstützung ist Liebe in Aktion.",
    science: "Studien zur 'Partner-Reagibilität' zeigen: Nichts senkt Stress so effektiv wie das Gefühl, dass der Partner die Lasten sieht.",
    sourceTitle: "Die Wissenschaft des Supports (Greater Good)",
    sourceUrl: "https://greatergood.berkeley.edu/article/item/how_to_support_partner_stressed"
  },
  {
    id: 5,
    question: "Wann fühlst du dich mir am nächsten – ist es beim Reden, beim Schweigen oder bei Berührung?",
    subtext: "Jeder spricht eine andere Sprache der Liebe.",
    science: "Missverständnisse entstehen, wenn wir Zuneigung so zeigen, wie wir sie selbst brauchen, statt wie der Partner sie empfängt.",
    sourceTitle: "Verstehe die Liebessprachen (Psychology Today)",
    sourceUrl: "https://www.psychologytoday.com/us/blog/click-here-happiness/202009/what-are-the-5-love-languages"
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
    sourceTitle: "Die Kraft der Verletzlichkeit (Brené Brown)",
    sourceUrl: "https://brenebrown.com/articles/"
  },
  {
    id: 8,
    question: "In welchem Moment warst du zuletzt richtig stolz darauf, wie wir als Team funktionieren?",
    subtext: "Wir sind mehr als die Summe unserer Teile.",
    science: "Das Bewusstsein für 'Collective Efficacy' (gemeinsame Wirksamkeit) stärkt die Identität als Paar massiv.",
    sourceTitle: "The Power of We (Psychology Today)",
    sourceUrl: "https://www.psychologytoday.com/us/blog/meet-catch-and-keep/202302/the-power-of-we-in-relationships"
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
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
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

  const handleRandomQuestion = () => {
    navigate('/frage', { replace: true });
    window.location.href = '/frage';
  };

  const handleGenerateQuestion = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    setShowSuccess(false);
    
    const steps = [
      "Analysiere Resonanz...",
      "Verstehe Kontext...",
      "Formuliere Impuls..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsGenerating(false);
    setShowSuccess(true);
    setUserInput("");
  };

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

        {/* AI Synchronizer Section */}
        <section className="px-6 pb-10 relative z-10">
          <div 
            className="max-w-xl mx-auto p-8 rounded-xl shadow-elevated text-center"
            style={{ 
              background: 'linear-gradient(145deg, #FFFDF9 0%, #F9F5F0 100%)',
              border: '1px solid hsl(var(--border))'
            }}
          >
            <h3 className="font-display text-2xl md:text-3xl text-primary mb-2">
              Eure Situation ist einzigartig?
            </h3>
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              Erzählt uns kurz von euch – Hertz an Hertz generiert eine Frage, die euch jetzt gerade synchronisiert.
            </p>
            
            {/* Textarea */}
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Wir sind frisch Eltern geworden und haben kaum Zeit... oder: Wir streiten oft über Kleinigkeiten..."
              className="w-full h-28 p-4 rounded-lg border border-border bg-white/80 text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm md:text-base"
              disabled={isGenerating}
            />
            
            {/* Magic Button */}
            <button
              onClick={handleGenerateQuestion}
              disabled={isGenerating || !userInput.trim()}
              className="mt-4 w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: isGenerating 
                  ? 'linear-gradient(135deg, #8B0000 0%, #C00000 100%)' 
                  : 'linear-gradient(135deg, #C00000 0%, #8B0000 50%, #C00000 100%)',
                backgroundSize: '200% 200%',
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{generationStep}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Persönliche Impuls-Frage generieren</span>
                </>
              )}
            </button>

            {/* Success Message */}
            {showSuccess && (
              <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-800 text-sm">
                  ✓ Deine Anfrage wurde verarbeitet. <span className="opacity-70">(Dies ist eine Demo für das MVP)</span>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="pb-12 px-6 relative z-10">
          <div className="flex flex-col items-center gap-4">
            {/* Outline Button - Random Question */}
            <button 
              onClick={handleRandomQuestion}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground"
            >
              Nächste zufällige Frage ziehen ↺
            </button>

            {/* Solid Button - Home */}
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg"
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
