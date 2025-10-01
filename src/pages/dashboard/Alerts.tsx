import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

interface Alert {
  id: string;
  type: "error" | "warning" | "info";
  product: string;
  productId: string;
  issue: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "alert_1",
    type: "error",
    product: "Wooden Salad Bowl",
    productId: "listing_12347",
    issue: "Missing required field",
    description: "Product is missing the 'availability' field required by ACP feed",
    timestamp: "1 day ago",
    resolved: false,
  },
  {
    id: "alert_2",
    type: "error",
    product: "Wooden Salad Bowl",
    productId: "listing_12347",
    issue: "Description too short",
    description: "Product description is only 5 words. Minimum 50 words recommended for ACP",
    timestamp: "1 day ago",
    resolved: false,
  },
  {
    id: "alert_3",
    type: "warning",
    product: "Blue Ceramic Mug",
    productId: "listing_12346",
    issue: "Low tag count",
    description: "Using only 2 out of 13 allowed tags. Add more tags to improve discoverability",
    timestamp: "2 days ago",
    resolved: false,
  },
  {
    id: "alert_4",
    type: "warning",
    product: "Beige Vase",
    productId: "listing_12345",
    issue: "Title could be longer",
    description: "Title is only 2 words. Longer titles (5-10 words) perform better in search",
    timestamp: "3 days ago",
    resolved: false,
  },
  {
    id: "alert_5",
    type: "info",
    product: "Hand-Painted Plate",
    productId: "listing_12348",
    issue: "New high-volume tag available",
    description: "The tag 'ceramic dinnerware' has 45% higher search volume than your current tags",
    timestamp: "4 days ago",
    resolved: false,
  },
];

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");

  const handleResolve = (alertId: string) => {
    setAlerts(alerts.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId));
  };

  const filteredAlerts = alerts.filter(
    (alert) => !alert.resolved && (filter === "all" || alert.type === filter)
  );

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return AlertCircle;
    }
  };

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: "text-red-500",
          text: "text-red-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          icon: "text-yellow-500",
          text: "text-yellow-500",
        };
      case "info":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          icon: "text-blue-500",
          text: "text-blue-500",
        };
    }
  };

  const errorCount = alerts.filter((a) => !a.resolved && a.type === "error").length;
  const warningCount = alerts.filter((a) => !a.resolved && a.type === "warning").length;
  const infoCount = alerts.filter((a) => !a.resolved && a.type === "info").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Alerts</h1>
          <p className="text-muted-foreground">
            Issues and recommendations for your product listings
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{errorCount}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{warningCount}</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{infoCount}</p>
                <p className="text-sm text-muted-foreground">Info</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "error", "warning", "info"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium transition-all capitalize ${
                filter === f
                  ? "bg-accent text-accent-foreground"
                  : "glass-panel text-muted-foreground hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            const colors = getAlertColor(alert.type);

            return (
              <div
                key={alert.id}
                className={`glass-panel p-6 rounded-2xl border ${colors.border} ${colors.bg}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${colors.icon}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {alert.issue}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Product: <span className="text-foreground font-medium">{alert.product}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center flex-shrink-0"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{alert.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark as Resolved
                        </button>
                        <a
                          href={`/dashboard/products?id=${alert.productId}`}
                          className="px-4 py-2 glass-panel hover:bg-white/10 text-foreground text-sm font-medium rounded-lg transition-colors"
                        >
                          View Product
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">All clear!</h3>
            <p className="text-muted-foreground">
              No {filter !== "all" ? filter : ""} alerts at the moment
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
