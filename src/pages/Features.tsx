import { GlassCard } from "@/components/GlassCard";
import { Zap, RefreshCw, TrendingUp, BarChart3, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "ACP Feed Builder",
      description: "Generate fully compliant ACP feeds with a single click. No technical knowledge required.",
      details: [
        "Automatic schema generation",
        "Real-time validation",
        "Instant deployment",
        "Version control"
      ]
    },
    {
      icon: RefreshCw,
      title: "Auto-Sync & Validation",
      description: "Keep your product feed fresh with automated synchronization and error checking.",
      details: [
        "Daily automatic updates",
        "Error detection & alerts",
        "Inventory tracking",
        "Price sync"
      ]
    },
    {
      icon: TrendingUp,
      title: "Trend & Keyword Alerts",
      description: "Stay ahead of AI shopping trends with intelligent notifications.",
      details: [
        "Keyword monitoring",
        "Trend detection",
        "Competitor insights",
        "Custom alerts"
      ]
    },
    {
      icon: BarChart3,
      title: "Ranking Snapshot",
      description: "Track your product performance in AI search results over time.",
      details: [
        "Performance metrics",
        "Visibility tracking",
        "Historical data",
        "Export reports"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with full GDPR and data protection compliance.",
      details: [
        "Encrypted data",
        "GDPR compliant",
        "Regular audits",
        "Secure hosting"
      ]
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Round-the-clock feed monitoring ensures your products are always discoverable.",
      details: [
        "Uptime monitoring",
        "Instant alerts",
        "Auto-recovery",
        "Status dashboard"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful features for{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              AI commerce
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Everything you need to make your Etsy shop discoverable by AI shopping assistants
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <GlassCard key={index} className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 font-light">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <GlassCard className="p-12 text-center bg-gradient-to-br from-accent/10 to-transparent">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to unlock these features?
            </h2>
            <p className="text-muted-foreground mb-6 font-light">
              Start with our free plan and upgrade anytime.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
