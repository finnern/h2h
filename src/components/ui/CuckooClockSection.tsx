export const CuckooClockSection = () => {
  return (
    <section className="relative w-full bg-[#FAF9F6] text-[#4A3728] py-24 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        
        <span className="text-rose-600 font-serif italic text-xl mb-4 block">
          Die Huygens-Entdeckung
        </span>

        <h2 className="text-4xl md:text-5xl font-serif mb-10 leading-[1.15]">
          Synchronisation durch<br/>gemeinsame Resonanz
        </h2>

        <div className="prose prose-lg text-[#4A3728]/80 leading-relaxed space-y-12">
          <div>
            <p className="font-semibold text-[#4A3728]">1665: Das Experiment</p>
            <p>
              Christiaan Huygens, der Erfinder der Pendeluhr, bemerkte etwas Merkwürdiges:
              Zwei Uhren, die am gleichen Holzbalken hingen, synchronisierten ihre Schwingungen
              automatisch.
            </p>
          </div>

          <div className="pl-6 border-l-2 border-rose-200">
            <p className="italic opacity-70">
              "Sie fanden durch unmerkliche Vibrationen im Holz immer in einen gemeinsamen Rhythmus."
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#4A3728]">Hertz an Hertz</p>
            <p>
              Wir nutzen dieses Prinzip für Beziehungen. Die Karten sind euer "Balken".
              Indem ihr euch auf die gleiche Frage (Frequenz) einstimmt, schafft ihr
              die Resonanz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
