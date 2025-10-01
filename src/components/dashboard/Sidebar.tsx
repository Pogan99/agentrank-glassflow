import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Zap, Bell, TrendingUp, Settings } from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", badge: null },
    { icon: Package, label: "Products", href: "/dashboard/products", badge: null },
    { icon: Zap, label: "Optimize", href: "/dashboard/optimize", badge: null },
    { icon: Bell, label: "Alerts", href: "/dashboard/alerts", badge: 5 },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics", badge: null },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", badge: null },
  ];

  return (
    <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-white/10 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
