import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-frost rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-2xl w-full p-12 md:p-16 text-center"
      >
        {/* Logo Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
            <Zap className="w-10 h-10 text-accent" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Welcome to AgentRanked
        </h1>

        {/* Subheading */}
        <p className="text-xl text-muted-foreground mb-8 font-light max-w-xl mx-auto">
          Get your Etsy products discovered in ChatGPT Shopping. We'll optimize your catalog for AI agents—automatically.
        </p>

        {/* Trust Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            {/* Avatar Circles */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-cyan-400/80 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-cyan-400/80 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-cyan-400/80 border-2 border-white"></div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>

            {/* Text */}
            <span className="text-sm font-medium text-foreground">
              4.8 · Small decisions that create big results.
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/onboarding/connect-store")}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-accent/30 transition-all inline-flex items-center gap-2 mb-8"
        >
          Get started
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;
