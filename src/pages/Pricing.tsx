import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Perfect for testing the waters",
      features: [
        "Basic ACP feed generation",
        "Manual sync",
        "Up to 5 products",
        "Community support",
        "Basic analytics"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Starter",
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      description: "Best for growing shops",
      features: [
        "Auto-sync every 24 hours",
        "Up to 50 products",
        "Email support",
        "Trend alerts",
        "Advanced analytics",
        "Custom branding",
        "Priority validation"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Pro",
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      description: "For established sellers",
      features: [
        "Unlimited products",
        "Real-time sync",
        "Priority support",
        "Advanced analytics",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options"
      ],
      cta: "Go Pro",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees, ever. You only pay for the plan you choose."
    },
    {
      question: "What happens if I exceed my product limit?",
      answer: "We'll notify you before you hit your limit. You can either upgrade your plan or choose which products to include in your feed."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. No questions asked."
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice;
    if (price === 0) return "Free";
    if (billingPeriod === "annual") {
      return `$${price}/year`;
    }
    return `$${price}/mo`;
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-light">
            Choose the plan that fits your business. All plans include core ACP features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 glass-panel rounded-full p-1">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === "monthly"
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === "annual"
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="ml-2 text-xs">Save 20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <GlassCard
              key={index}
              className={`p-8 ${
                plan.popular ? "ring-2 ring-accent bg-gradient-to-br from-accent/5 to-transparent" : ""
              }`}
            >
              {plan.popular && (
                <div className="text-accent text-sm font-semibold mb-2">MOST POPULAR</div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 font-light">{plan.description}</p>
              <div className="text-4xl font-bold mb-6">
                {getPrice(plan)}
              </div>
              <Button
                className={`w-full mb-6 ${
                  plan.popular
                    ? "bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    : ""
                }`}
                variant={plan.popular ? "default" : "ghost"}
              >
                {plan.cta}
              </Button>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <GlassCard className="p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
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
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
