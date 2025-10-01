import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TrendingUp, ShoppingBag, Zap, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Dashboard = () => {
  const metrics = [
    {
      label: "ACP Readiness",
      value: "78",
      unit: "/100",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      description: "Average across all products",
    },
    {
      label: "Products Optimized",
      value: "42",
      unit: "/150",
      change: "+8",
      trend: "up",
      icon: Zap,
      description: "This month",
    },
    {
      label: "Active Listings",
      value: "150",
      unit: "",
      change: "+5",
      trend: "up",
      icon: ShoppingBag,
      description: "Connected from Etsy",
    },
    {
      label: "Issues Detected",
      value: "12",
      unit: "",
      change: "-3",
      trend: "down",
      icon: AlertCircle,
      description: "Requiring attention",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Optimized",
      product: "Hand-Made Beige Vase",
      acpBefore: 42,
      acpAfter: 87,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      action: "Optimized",
      product: "Blue Ceramic Coffee Mug",
      acpBefore: 35,
      acpAfter: 82,
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      action: "Alert",
      product: "Wooden Salad Bowl",
      issue: "Missing required field: availability",
      timestamp: "1 day ago",
    },
  ];

  const quickActions = [
    {
      title: "Optimize Products",
      description: "Review and optimize your product listings",
      href: "/dashboard/products",
      color: "bg-gradient-to-br from-cyan-500 to-blue-600",
    },
    {
      title: "View Analytics",
      description: "Track your ACP performance over time",
      href: "/dashboard/analytics",
      color: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
    {
      title: "Resolve Alerts",
      description: "Fix 12 issues in your listings",
      href: "/dashboard/alerts",
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      badge: "12",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your AgentRank performance and activity
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.trend === "up";
            const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
            const trendColor = isPositive ? "text-green-500" : "text-red-500";

            return (
              <div key={index} className="glass-panel p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
                    <TrendIcon className="h-4 w-4" />
                    {metric.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {metric.value}
                    <span className="text-lg text-muted-foreground">{metric.unit}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`${action.color} p-6 rounded-2xl text-white hover:scale-105 transition-transform relative overflow-hidden group`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                    {action.badge && (
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/90">{action.description}</p>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="glass-panel rounded-2xl divide-y divide-white/10">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          activity.action === "Optimized"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {activity.action}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {activity.product || activity.product}
                      </span>
                    </div>
                    {activity.acpBefore && activity.acpAfter ? (
                      <p className="text-sm text-muted-foreground">
                        ACP Score: {activity.acpBefore} → {activity.acpAfter}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">{activity.issue}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
