import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingButton } from "@/components/LoadingButton";
import { Toast, ToastType } from "@/components/Toast";
import { Store, Bell, CreditCard, User, Shield, Trash2 } from "lucide-react";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const [settings, setSettings] = useState({
    // Store Connection
    shopifyStoreName: "YourShopifyStore",
    syncFrequency: "hourly",

    // Notifications
    emailNotifications: true,
    weeklyReports: true,
    alertsEnabled: true,

    // Profile
    fullName: "Jane Doe",
    email: "jane@example.com",

    // Plan
    currentPlan: "Starter",
    creditsPerDay: 20,
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setToast({ message: "Settings saved successfully!", type: "success" });
  };

  const handleDisconnect = () => {
    setToast({ message: "Store disconnected. Reconnect to continue using AgentRanked.", type: "warning" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Store Connection */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Store Connection</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Shopify Store Name
            </label>
            <input
              type="text"
              value={settings.shopifyStoreName}
              onChange={(e) => setSettings({ ...settings, shopifyStoreName: e.target.value })}
              className="w-full px-4 py-3 glass-panel rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Sync Frequency
            </label>
            <select
              value={settings.syncFrequency}
              onChange={(e) => setSettings({ ...settings, syncFrequency: e.target.value })}
              className="w-full px-4 py-3 glass-panel rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <button
            onClick={handleDisconnect}
            className="text-sm text-red-500 hover:underline flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Disconnect Store
          </button>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive emails about product updates
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({ ...settings, emailNotifications: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly Reports</p>
              <p className="text-xs text-muted-foreground">
                Get weekly performance summaries
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyReports}
              onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-foreground">Alert Notifications</p>
              <p className="text-xs text-muted-foreground">
                Get notified about product issues
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.alertsEnabled}
              onChange={(e) => setSettings({ ...settings, alertsEnabled: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
            />
          </label>
        </div>

        {/* Profile */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Profile</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={settings.fullName}
              onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
              className="w-full px-4 py-3 glass-panel rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-3 glass-panel rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <button className="text-sm text-accent hover:underline">Change Password</button>
        </div>

        {/* Plan & Billing */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Plan & Billing</h2>
          </div>

          <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Current Plan</p>
              <p className="text-2xl font-bold text-accent">{settings.currentPlan}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {settings.creditsPerDay} optimizations per day
              </p>
            </div>
            <button className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl transition-colors">
              Upgrade Plan
            </button>
          </div>

          <a href="/pricing" className="text-sm text-accent hover:underline inline-block">
            View all plans
          </a>
        </div>

        {/* Security */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
          </div>

          <div className="space-y-3">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Two-factor authentication
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
              Active sessions
            </button>
            <button className="text-sm text-red-500 hover:underline block">
              Delete account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <LoadingButton onClick={handleSave} isLoading={isLoading}>
            Save Changes
          </LoadingButton>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default Settings;
