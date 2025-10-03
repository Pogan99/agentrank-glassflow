import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TrendingUp, ShoppingBag, Zap, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { APIClient } from "@/lib/api/client";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      APIClient.getProfile(user.id),
      APIClient.getProducts(user.id, { limit: 10 }),
      APIClient.getAlerts(user.id, { limit: 5 }),
    ])
      .then(([profileData, productsData, alertsData]) => {
        setProfile(profileData);
        setProducts(productsData);
        setAlerts(alertsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // Redirect if no shopify connected
  useEffect(() => {
    if (!loading && profile && !profile.shopify_shop_domain) {
      navigate('/onboarding/connect-store');
    }
  }, [profile, loading, navigate]);

  const activeProducts = products.filter(p => p.status === 'active').length;
  const optimizedProducts = products.filter(p => p.acp_compliant).length;
  const avgScore = products.length > 0
    ? Math.round(products.reduce((sum, p) => sum + (p.acp_score || 0), 0) / products.length)
    : 0;

  const metrics = [
    {
      label: "ACP Readiness",
      value: avgScore.toString(),
      unit: "/100",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      description: "Average across all products",
    },
    {
      label: "Products Optimized",
      value: optimizedProducts.toString(),
      unit: `/${activeProducts}`,
      change: `+${optimizedProducts}`,
      trend: "up",
      icon: Zap,
      description: "ACP compliant",
    },
    {
      label: "Active Listings",
      value: activeProducts.toString(),
      unit: "",
      change: "+0",
      trend: "up",
      icon: ShoppingBag,
      description: "Connected from Shopify",
    },
    {
      label: "Issues Detected",
      value: alerts.filter(a => !a.dismissed).length.toString(),
      unit: "",
      change: `-${alerts.filter(a => a.read).length}`,
      trend: "down",
      icon: AlertCircle,
      description: "Requiring attention",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const recentActivity = products.slice(0, 3).map((p, idx) => ({
    id: idx,
    action: p.acp_compliant ? "Optimized" : "Needs Review",
    product: p.title,
    acpBefore: Math.max(0, (p.acp_score || 0) - 30),
    acpAfter: p.acp_score,
    timestamp: new Date(p.updated_at).toLocaleDateString(),
  }));

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
                    <p className="text-sm text-muted-foreground">
                      ACP Score: {activity.acpBefore} → {activity.acpAfter}
                    </p>
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
