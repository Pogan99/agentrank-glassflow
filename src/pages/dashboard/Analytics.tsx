import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TrendingUp, Eye, Zap, ShoppingBag } from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const chartData = {
    "7d": [45, 52, 48, 61, 58, 67, 72],
    "30d": [42, 45, 51, 48, 55, 58, 62, 59, 65, 68, 71, 69, 74, 78],
    "90d": [35, 38, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78],
  };

  const labels = {
    "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "30d": Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
    "90d": Array.from({ length: 15 }, (_, i) => `Week ${i + 1}`),
  };

  const data = chartData[timeRange];
  const maxValue = Math.max(...data);

  const metrics = [
    {
      label: "Avg ACP Score",
      value: "78",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-cyan-500",
    },
    {
      label: "Products Optimized",
      value: "42",
      change: "+8",
      trend: "up",
      icon: Zap,
      color: "text-purple-500",
    },
    {
      label: "Impressions",
      value: "12.4K",
      change: "+24%",
      trend: "up",
      icon: Eye,
      color: "text-blue-500",
    },
    {
      label: "Active Products",
      value: "150",
      change: "+5",
      trend: "up",
      icon: ShoppingBag,
      color: "text-green-500",
    },
  ];

  const topProducts = [
    { name: "Hand-Made Beige Vase", score: 87, improvement: 45, impressions: 2340 },
    { name: "Blue Ceramic Coffee Mug", score: 82, improvement: 47, impressions: 2180 },
    { name: "Rustic Wooden Bowl", score: 75, improvement: 50, impressions: 1950 },
    { name: "Ceramic Dinner Plate", score: 71, improvement: 38, impressions: 1820 },
    { name: "Glass Flower Vase", score: 68, improvement: 42, impressions: 1650 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
            <p className="text-muted-foreground">
              Track your ACP performance and product metrics over time
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  timeRange === range
                    ? "bg-accent text-accent-foreground"
                    : "glass-panel text-muted-foreground hover:bg-white/10"
                }`}
              >
                {range === "7d" && "7 Days"}
                {range === "30d" && "30 Days"}
                {range === "90d" && "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-green-500">{metric.change}</span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-xl font-semibold text-foreground mb-6">ACP Score Trend</h2>

          {/* Simple Bar Chart */}
          <div className="space-y-2">
            <div className="flex items-end justify-between h-64 gap-2">
              {data.map((value, index) => {
                const height = (value / maxValue) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-accent to-cyan-400 rounded-t-lg hover:opacity-80 transition-opacity relative group"
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Score: {value}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground text-center">
                      {labels[timeRange][index] || ""}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Y-Axis Labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-4">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="glass-panel p-8 rounded-2xl">
          <h2 className="text-xl font-semibold text-foreground mb-6">Top Performing Products</h2>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 glass-panel rounded-xl hover:bg-white/5 transition-colors"
              >
                {/* Rank */}
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent">{index + 1}</span>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.impressions.toLocaleString()} impressions
                  </p>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">ACP Score</p>
                    <p className="text-lg font-bold text-foreground">{product.score}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Improvement</p>
                    <p className="text-lg font-bold text-green-500">+{product.improvement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-cyan-500/10 border border-accent/20">
          <h3 className="text-lg font-semibold text-foreground mb-3">Insights</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>
                Your ACP score has improved by <strong className="text-accent">12%</strong> over
                the last 30 days
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>
                Products optimized in the last week received{" "}
                <strong className="text-accent">24% more impressions</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent">•</span>
              <span>
                You have <strong className="text-accent">108 products</strong> that could benefit
                from optimization
              </span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
