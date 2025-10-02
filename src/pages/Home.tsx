import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Check,
  Zap,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Code,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
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
      description: "Connect Etsy via OAuth. We map your catalog to ACP spec instantly.",
    },
    {
      icon: RefreshCw,
      title: "Auto-Sync & Validation",
      description: "Hourly sync keeps pricing and stock fresh. Get alerts on errors.",
    },
    {
      icon: TrendingUp,
      title: "Trend-Aware Alerts",
      description: "When search trends shift, we suggest title/tag updates.",
    },
    {
      icon: BarChart3,
      title: "Ranking Snapshot",
      description: "See how you rank in your Etsy category vs competitors.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      features: ["ACP feed generation", "1 optimization/day", "Weekly sync", "Basic validation"],
    },
    {
      name: "Starter",
      price: "$9.99",
      popular: true,
      features: ["20 optimizations/day", "Daily sync", "Email alerts", "Trend insights"],
    },
    {
      name: "Pro",
      price: "$49.99",
      features: ["Unlimited optimizations", "Hourly sync", "Priority support", "Backlinks + content"],
    },
  ];

  const faqs = [
    {
      question: "What is ACP and why do I need it?",
      answer:
        "ACP (Agentic Commerce Protocol) is the standard that AI assistants like ChatGPT use to discover products. Without an ACP feed, your Etsy shop is invisible to millions of AI-powered shoppers who use ChatGPT Shopping.",
    },
    {
      question: "How quickly can I get set up?",
      answer:
        "Most shops are ACP-ready in under 5 minutes. Just connect your Etsy store via OAuth and we'll generate your feed automatically.",
    },
    {
      question: "Do I need technical knowledge?",
      answer: "Not at all! AgentRank automates everything. No coding, no spreadsheets, no manual work.",
    },
    {
      question: "How often does the feed update?",
      answer:
        "Free plans sync weekly, Starter plans sync daily, and Pro plans sync hourly to keep your inventory fresh.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes! All paid plans are month-to-month with no long-term commitment required.",
    },
  ];

  return (
    <div className="min-h-screen">
    {/* Hero Section */}
<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
  <div className="max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-frost rounded-3xl p-12 md:p-16 relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-70" />
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Get your Shopify store discovered by{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent drop-shadow">
              AI shoppers
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl font-light">
            AgentRank auto-builds and hosts an ACP feed so ChatGPT can surface your products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 text-foreground font-light">
            {["One-click ACP feed", "Hourly sync", "Trend alerts"].map((text) => (
              <span key={text} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent shadow-accent shadow-md" />
                {text}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 rounded-full shadow-lg shadow-accent/30 group"
            >
              <Link to="/signup">
                Get ACP-Ready
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-foreground hover:text-accent text-lg font-medium rounded-full"
            >
              <a href="#features">
                See Features
                <ChevronDown className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/5">
            <img
              src="/shopify.png"
              alt="Etsy seller at work"
              className="w-full h-auto object-cover rounded-3xl"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
</section>

      {/* What is ACP Section */}
      <section id="acp" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[60%_40%] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-frost rounded-3xl p-10 backdrop-blur-xl border border-white/10 shadow-xl relative"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What is ACP & Why Now?</h2>
            <p className="text-muted-foreground mb-6 font-light">
              ACP (Agentic Commerce Protocol) lets AI shopping assistants like ChatGPT discover and recommend products.
              Without an ACP feed, your Etsy shop is invisible to millions of AI-powered shoppers.
            </p>
            <div className="space-y-3">
              {[
                "ACP-compliant JSON feed hosted on your domain",
                "robots.txt configured for AI crawler access",
                "Hourly sync keeps inventory & pricing accurate",
                "Validation catches errors before AI sees them",
                "Optimized metadata improves product match quality",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <GlassCard className="p-8 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-mono text-accent">feed.json</span>
              <Code className="h-5 w-5 text-muted-foreground" />
            </div>
            <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`{
  "products": [
    {
      "id": "etsy-12345",
      "name": "Handcrafted Mug",
      "price": 24.99,
      "currency": "USD",
      "availability": "in_stock",
      "url": "https://etsy.com/...",
      "image": "https://cdn.etsy/..."
    }
  ]
}`}
            </pre>
          </GlassCard>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Others make you do the work —{" "}
              <span className="text-accent">AgentRank automates it</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard className="p-8 backdrop-blur-lg border border-white/10 shadow-xl">
              <div className="text-red-400 font-semibold mb-4">❌ Manual Approach</div>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Export CSV from Etsy</li>
                <li>• Format spreadsheet manually</li>
                <li>• Upload to hosting</li>
                <li>• Configure robots.txt</li>
                <li>• Repeat weekly</li>
              </ul>
            </GlassCard>
            <GlassCard className="p-8 bg-gradient-to-br from-accent/10 to-transparent backdrop-blur-lg border border-white/10 shadow-xl">
              <div className="text-accent font-semibold mb-4">✓ AgentRank Way</div>
              <ul className="space-y-3 text-foreground">
                <li>• Connect Etsy once</li>
                <li>• Auto-sync daily</li>
                <li>• Validation included</li>
                <li>• Hosting included</li>
                <li>• Set and forget</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg font-light">
              Built for Etsy sellers, powered by automation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                className="p-6 text-center backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-2xl transition"
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-light">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-lg font-light">Start free, scale as you grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {pricingPlans.map((plan, index) => (
              <GlassCard
                key={index}
                className={`p-8 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-2xl transition ${
                  plan.popular
                    ? "ring-2 ring-accent bg-gradient-to-br from-accent/5 to-transparent"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="text-accent text-sm font-semibold mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span className="text-lg text-muted-foreground font-normal">/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.popular ? "default" : "ghost"}>
                  {plan.name === "Free" ? "Start Free" : "Get Started"}
                </Button>
              </GlassCard>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="ghost" className="text-accent hover:text-accent/90">
              <Link to="/pricing">
                View full pricing details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <GlassCard className="p-8 backdrop-blur-lg border border-white/10 shadow-xl">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-white/10"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-accent">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-light">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center bg-gradient-to-br from-accent/10 to-transparent backdrop-blur-lg border border-white/10 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get discovered?</h2>
            <p className="text-muted-foreground mb-8 text-lg font-light">
              Join thousands of Etsy sellers who are already ACP-ready.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 shadow-lg shadow-accent/30"
            >
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Home;
