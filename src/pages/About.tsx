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
              Back
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
              About Hertz an Hertz
            </motion.h1>
            <motion.h2 
              className="font-body text-xl md:text-2xl text-ink/80 italic max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Where science meets heartbeat—and technology meets tradition.
            </motion.h2>
            <motion.div 
              className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4"
              variants={fadeInUp}
            >
              <p>
                Welcome to Hertz an Hertz. We believe that love is more than just a fleeting feeling. 
                It is physics—a vibration that needs nurturing.
              </p>
              <p>
                Our philosophy is based on a fascinating discovery by physicist Christiaan Huygens 
                in 1665: He observed that two pendulum clocks hanging from the same wooden beam eventually 
                adjust their swings to match each other perfectly. He called this phenomenon <em>synchronization</em>.
              </p>
              <p>
                In a relationship, you are these two clocks. And Hertz an Hertz is the sounding board 
                that connects you, helping you find your shared rhythm.
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
              The "Council of the Wise": Our Global DNA
            </h1>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              This card deck is not a random product. It is the result of a deep analysis of the world's 
              leading relationship experts. Our Artificial Intelligence was not trained on simplistic 
              calendar mottos, but on the "gold standards" of modern couples therapy—both international and European.
            </p>
            <p className="font-body text-ink/80 text-center italic">
              Every card you hold in your hand is based on the principles of these thought leaders:
            </p>

            {/* International Pioneers */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink border-b border-border pb-2">
                The International Pioneers
              </h3>
              <ul className="space-y-6">
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Drs. John & Julie Gottman</strong> (The Seven Principles for Making Marriage Work): 
                  The architects of the famous "Love Lab." From them comes the concept of "Love Maps." 
                  Our questions help you constantly update these internal maps of your partner, 
                  because we know: You can only deeply love what you truly know.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Esther Perel</strong> (Mating in Captivity): 
                  She explores the eternal tension between safety and adventure. Her wisdom flows 
                  into our deep questions to preserve the mystery in your relationship 
                  and prevent everything from suffocating in routine.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Dr. Sue Johnson</strong> (Hold Me Tight): 
                  The founder of Emotionally Focused Therapy (EFT). Her work teaches us that behind 
                  almost every argument lies one anxious question: "Are you really there for me?" Our cards 
                  create the safe space to answer this question together.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Terry Real</strong> (The New Rules of Marriage): 
                  He coined modern "Us-Consciousness." His strategies help us shift from an egocentric 
                  battle to a collaborative partnership—becoming a team.
                </li>
              </ul>
            </div>

            {/* European Grounding */}
            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink border-b border-border pb-2">
                The European Grounding
              </h3>
              <p className="font-body text-ink/70 leading-relaxed">
                To integrate grounded perspectives and cultural nuance, we rely on leading voices from the German-speaking world:
              </p>
              <ul className="space-y-6">
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Stefanie Stahl</strong> (The Child in You): 
                  Essential for working with the "Inner Child." Our prompts help distinguish: 
                  Is my adult self speaking right now, or an old wound from the past?
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Michael Mary</strong> (The 5 Lies of Love): 
                  Our anchor for healthy realism. He teaches us that expectations are negotiable 
                  and conflicts do not mean the end. This relieves the pressure.
                </li>
                <li className="font-body text-ink/70 leading-relaxed">
                  <strong className="text-ink">Oskar Holzberg</strong> (Key Sentences of Love): 
                  The master of everyday life. His observations flow into our micro-rituals, 
                  ensuring love survives amidst dishwashing, job stress, and raising children.
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
              The Technology: Your Story in Safe Hands
            </h1>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              Here, modern analysis meets human need. Our AI uses this concentrated expertise 
              as a flexible toolbox to find the right prompts for you. Yet we know: Technology—especially 
              AI—can feel intimidating. That's why we operate on the principle of absolute sovereignty over your data.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Card 1 */}
              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  1. Works Without Baring Your Soul
                </h3>
                <p className="font-body text-ink/70 text-sm leading-relaxed">
                  You don't have to tell the AI anything about yourselves if you don't want to. 
                  Even without specific knowledge of your personal situation, the system generates wonderful impulses. 
                  Why? Because the universal principles of Gottman, Perel, or Stahl are so strong that they enrich every relationship.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  2. The Turbo Charge: Tailor-Made
                </h3>
                <p className="font-body text-ink/70 text-sm leading-relaxed">
                  However, if you choose to give the AI context (e.g., "We just became parents" 
                  or "We are navigating a loss"), it can refine the questions. Instead of generic advice, 
                  you receive prompts that start exactly where you currently are.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-card/60 rounded-xl p-6 border border-border space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-heartbeat" />
                </div>
                <h3 className="font-display text-lg text-ink">
                  3. Our Safety Promise
                </h3>
                <div className="font-body text-ink/70 text-sm leading-relaxed space-y-2">
                  <p className="font-semibold text-ink">Your privacy is our highest asset.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>No AI Training:</strong> None of your inputs are used to train the AI. Your data stays with you.</li>
                    <li><strong>GDPR Compliance:</strong> We strictly adhere to the General Data Protection Regulation.</li>
                    <li><strong>Data Economy:</strong> Your information is only stored securely encrypted if you explicitly wish it—for example, to develop further, even more fitting card decks for you later. Otherwise, the rule applies: What happens in the moment, stays in the moment.</li>
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
              The Soul: Grandfather Hartschierle's Legacy
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
                alt="Hartschierle - Flute player by the tree"
                className="h-56 md:h-72 w-auto object-contain drop-shadow-lg"
              />
            </motion.div>

            <div className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4 text-center">
              <p>
                Yet science, data, and algorithms are often loud and fast. 
                Sometimes love needs the exact opposite: Silence, slowness, and humility.
              </p>
              <p className="font-semibold text-ink">
                May we introduce: Grandfather Hartschierle.
              </p>
              <p>
                He was by no means a relationship expert in the classical sense. On the contrary: 
                He avoided the hustle and bustle of people. He withdrew as a hermit into the solitude 
                of a cave deep in the Black Forest to find answers there that get drowned out in the noise of everyday life.
              </p>
              <p>
                He was an observer who drew his wisdom not from books, but from the rustling of the treetops, 
                the moss on the stones, and the eternal cycle of nature. He taught us that answers often lie 
                not in hectic exchange, but in enduring silence together.
              </p>
              <p>
                In Hertz an Hertz, he is the resting pole. He doesn't ask you to talk, but simply to be present. 
                His cards are invitations to calmness:
              </p>
            </div>

            {/* Quote Block */}
            <blockquote className="max-w-2xl mx-auto bg-card/80 border-l-4 border-heartbeat p-6 rounded-r-xl italic">
              <p className="font-body text-ink text-lg leading-relaxed">
                "Listen to the forest. In the silence, thoughts clarify—and therein, 
                you finally hear the other person's heart beating again."
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
              The Visual Roots: The Real Painter "Hartschierle"
            </h3>
            <p className="font-body text-ink/70 leading-relaxed text-center max-w-3xl mx-auto">
              The visual soul of our project is based on the unique style of a real 19th-century painter 
              from Schramberg, Germany, known historically as "Hartschierle." We use his naive yet character-rich 
              folk art to give our modern technology deep, regional roots.
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
                Learn more about the true story behind the pictures →
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
              Your Pillar for a Living Relationship
            </h1>
            <div className="font-body text-ink/70 leading-relaxed max-w-3xl mx-auto space-y-4">
              <p>
                Synchronization doesn't mean you have to march in perfect unison all the time.
              </p>
              <p>
                It's about finding your way back to each other after dissonance. It's about mechanisms 
                that help you absorb life's challenges and get back into resonance. 
                Hertz an Hertz aims to be one of the supporting pillars that aids you in this.
              </p>
              <p>
                Find your rhythm. So that what we all long for can emerge: A love that grows and thrives.
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
