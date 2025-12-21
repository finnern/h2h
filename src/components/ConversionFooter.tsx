import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartbeatLine } from "./HeartbeatLine";
import { toast } from "@/hooks/use-toast";

interface ConversionFooterProps {
  isVisible: boolean;
}

export const ConversionFooter = ({ isVisible }: ConversionFooterProps) => {
  const [email, setEmail] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const handleReserve = () => {
    // Simulate reservation - in real app, would integrate with payment
    setIsReserved(true);
    toast({
      title: "Reserved! 🎉",
      description: "You're on the priority list for the first batch.",
    });
  };

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsJoined(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you when Hertz an Hertz launches.",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.footer
      className="w-full mt-16 pb-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Divider */}
        <HeartbeatLine className="mb-12 opacity-40" />

        {/* Pitch */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Heart className="w-12 h-12 text-heartbeat mx-auto mb-4" />
          </motion.div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-4">
            This was just a 4-card sample
          </h2>
          <p className="font-body text-xl text-ink-light max-w-2xl mx-auto leading-relaxed">
            The full ritual is <span className="font-semibold text-ink">52 cards</span>—one 
            for every date night of the year. A premium physical deck, personalized to your 
            journey together.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Priority Reserve */}
          <motion.div
            className="bg-card rounded-2xl p-6 border-2 border-primary shadow-card-hover"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <CreditCard className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl text-ink mb-2">
                Reserve First Batch
              </h3>
              <p className="font-body text-ink-light mb-4">
                €5 Priority Down Payment
              </p>
              <Button
                onClick={handleReserve}
                disabled={isReserved}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display text-lg py-5"
              >
                {isReserved ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Reserved!
                  </>
                ) : (
                  "Secure My Deck"
                )}
              </Button>
              <p className="font-body text-xs text-muted-foreground mt-3">
                VIP access to launch & exclusive content
              </p>
            </div>
          </motion.div>

          {/* Waitlist */}
          <motion.div
            className="bg-card rounded-2xl p-6 border border-border shadow-card"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary mb-4">
                <Mail className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-display text-2xl text-ink mb-2">
                Notify Me
              </h3>
              <p className="font-body text-ink-light mb-4">
                Join the waitlist for updates
              </p>
              {isJoined ? (
                <div className="flex items-center justify-center gap-2 py-3 text-primary">
                  <Check className="h-5 w-5" />
                  <span className="font-display text-lg">You're on the list!</span>
                </div>
              ) : (
                <form onSubmit={handleJoinWaitlist} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-body bg-paper border-border text-center"
                    required
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full font-display text-lg py-5 border-border hover:bg-secondary"
                  >
                    Join Waitlist
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Brand footer */}
        <div className="text-center mt-12">
          <p className="font-display text-3xl text-heartbeat">
            Hertz an Hertz
          </p>
          <p className="font-body text-sm text-muted-foreground mt-2 italic">
            The Sync Engine for Couples
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
