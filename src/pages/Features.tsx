import { GlassCard } from "@/components/GlassCard";
import { Zap, RefreshCw, TrendingUp, BarChart3, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "ACP Feed Builder for Etsy",
      description: "Connect your Etsy shop via OAuth and we'll instantly generate a standards-compliant ACP feed. No spreadsheets, no manual mapping—just one click to make your catalog AI-discoverable.",
      details: [
        "Automatic Etsy OAuth integration",
        "Real-time ACP schema mapping",
        "Hosted feed with CDN delivery",
        "robots.txt configuration included"
      ]
    },
    {
      icon: RefreshCw,
      title: "Feed Hosting & Health",
      description: "We host your ACP feed with 99.9% uptime and continuous validation. Get email or Slack alerts when errors are detected, so you can fix issues before AI shoppers see them.",
      details: [
        "Always-on feed hosting with CDN",
        "Real-time validation against ACP spec",
        "Error UI with actionable fix suggestions",
        "Health dashboard with uptime metrics"
      ]
    },
    {
      icon: Clock,
      title: "Auto-Sync & Jobs",
      description: "Set it and forget it. AgentRank syncs your Etsy inventory on a schedule (hourly for Pro, daily for Starter, weekly for Free). Event triggers re-sync when you update listings.",
      details: [
        "Scheduled cron jobs (hourly/daily/weekly)",
        "Event-based triggers on Etsy updates",
        "Configurable sync windows",
        "Job history & logs"
      ]
    },
    {
      icon: TrendingUp,
      title: "Trend-Aware Automation",
      description: "When AI search trends surge for keywords in your niche, we detect it and suggest title/tag updates. Review and approve changes, then we push them to Etsy automatically.",
      details: [
        "AI search trend monitoring",
        "Auto-generated title & tag suggestions",
        "Approve/reject workflow",
        "One-click push to Etsy API"
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
