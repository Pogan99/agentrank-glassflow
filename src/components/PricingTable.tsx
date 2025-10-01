import { Check, X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface PricingTableProps {
  className?: string;
}

export const PricingTable = ({ className }: PricingTableProps) => {
  const features = [
    { name: "ACP feed generation & hosting", free: true, starter: true, pro: true },
    { name: "ACP optimizations (pushes to Etsy)", free: "1/day (~30/mo)", starter: "20/day (~600/mo)", pro: "Unlimited" },
    { name: "Sync frequency", free: "Weekly", starter: "Daily", pro: "Hourly" },
    { name: "Feed validation & health", free: "Basic errors", starter: "Advanced + email alerts", pro: "Advanced + Slack + auto-fix" },
    { name: "Trend & keyword alerts", free: false, starter: true, pro: "Priority" },
    { name: "Category rank & competitor gaps", free: false, starter: "Summary", pro: "Full detail + graph" },
    { name: "Notification center", free: false, starter: true, pro: true },
    { name: "Content engine (blog posts)", free: false, starter: false, pro: "10 posts/mo" },
    { name: "Backlinks from AgentRank", free: false, starter: false, pro: "Priority placement" },
    { name: "ACP Readiness Score badge", free: false, starter: true, pro: true },
    { name: "Support", free: "Forum", starter: "Email 24h", pro: "Priority email + Slack 6h" },
    { name: "SLA", free: false, starter: false, pro: "99.9% uptime" },
  ];

  const renderCell = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-accent mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
      );
    }
    return <span className="text-sm text-foreground">{value}</span>;
  };

  return (
    <GlassCard className={className}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-4 font-semibold text-foreground">Feature</th>
              <th className="text-center py-4 px-4">
                <div className="font-bold text-xl mb-1">Free</div>
                <div className="text-2xl font-bold text-accent mb-2">$0</div>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/signup">Start Free</Link>
                </Button>
              </th>
              <th className="text-center py-4 px-4 bg-accent/5 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="font-bold text-xl mb-1 mt-4">Starter</div>
                <div className="text-2xl font-bold text-accent mb-2">$9.99<span className="text-sm text-muted-foreground">/mo</span></div>
                <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full">
                  <Link to="/signup">Get Started</Link>
                </Button>
              </th>
              <th className="text-center py-4 px-4">
                <div className="font-bold text-xl mb-1">Pro</div>
                <div className="text-2xl font-bold text-accent mb-2">$49.99<span className="text-sm text-muted-foreground">/mo</span></div>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/signup">Go Pro</Link>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-4 text-sm text-muted-foreground font-light">{feature.name}</td>
                <td className="py-4 px-4 text-center">{renderCell(feature.free)}</td>
                <td className="py-4 px-4 text-center bg-accent/5">{renderCell(feature.starter)}</td>
                <td className="py-4 px-4 text-center">{renderCell(feature.pro)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
