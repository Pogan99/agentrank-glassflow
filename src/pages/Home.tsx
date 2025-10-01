import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Check, Zap, RefreshCw, TrendingUp, BarChart3, Code, ArrowRight, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: "ACP Feed Builder",
      description: "Connect Etsy via OAuth. We map your catalog to ACP spec instantly."
    },
    {
      icon: RefreshCw,
      title: "Auto-Sync & Validation",
      description: "Hourly sync keeps pricing and stock fresh. Get alerts on errors."
    },
    {
      icon: TrendingUp,
      title: "Trend-Aware Alerts",
      description: "When search trends shift, we suggest title/tag updates."
    },
    {
      icon: BarChart3,
      title: "Ranking Snapshot",
      description: "See how you rank in your Etsy category vs competitors."
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: ["ACP feed generation", "1 optimization/day", "Weekly sync", "Basic validation"]
    },
    {
      name: "Starter",
      price: "$9.99",
      popular: true,
      features: ["20 optimizations/day", "Daily sync", "Email alerts", "Trend insights"]
    },
    {
      name: "Pro",
      price: "$49.99",
      features: ["Unlimited optimizations", "Hourly sync", "Priority support", "Backlinks + content"]
    }
  ];

  const faqs = [
    {
      question: "What is ACP and why do I need it?",
      answer: "ACP (Agentic Commerce Protocol) is the standard that AI assistants like ChatGPT use to discover products. Without an ACP feed, your Etsy shop is invisible to millions of AI-powered shoppers who use ChatGPT Shopping."
    },
    {
      question: "How quickly can I get set up?",
      answer: "Most shops are ACP-ready in under 5 minutes. Just connect your Etsy store via OAuth and we'll generate your feed automatically."
    },
    {
      question: "Do I need technical knowledge?",
      answer: "Not at all! AgentRank automates everything. No coding, no spreadsheets, no manual work."
    },
    {
      question: "How often does the feed update?",
      answer: "Free plans sync weekly, Starter plans sync daily, and Pro plans sync hourly to keep your inventory fresh."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes! All paid plans are month-to-month with no long-term commitment required."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left side (text + buttons) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-frost rounded-3xl p-10 md:p-14 relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-cyan-200/10 opacity-70 pointer-events-none" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                Get your Etsy shop discovered by{" "}
                <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent drop-shadow">
                  AI shoppers
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-xl font-light">
                AgentRank auto-builds and hosts an ACP feed so ChatGPT can surface your products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 text-foreground font-light">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shadow-accent shadow-md" />
                  One-click ACP feed
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shadow-accent shadow-md" />
                  Hourly sync
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shadow-accent shadow-md" />
                  Trend alerts
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 rounded-full shadow-lg shadow-accent/40 group transition-all">
                  <Link to="/signup">
                    Get ACP-Ready
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg" className="text-foreground hover:text-accent text-lg font-medium rounded-full">
                  <a href="#features">
                    See Features
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right side (Hero image) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5">
              <img
                src="/Hero.png"
                alt="Hero showcase"
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- rest of your sections (What is ACP, Features, Pricing, FAQ, CTA) remain unchanged --- */}

    </div>
  );
};

export default Home;
