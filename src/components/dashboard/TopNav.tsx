import { Link, useNavigate } from "react-router-dom";
import { Store, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { APIClient } from "@/lib/api/client";

export const TopNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      APIClient.getProfile(user.id).then(setProfile).catch(console.error);
    }
  }, [user]);

  const credits = {
    used: profile?.optimization_credits_used || 0,
    limit: profile?.optimization_credits_limit || 30,
  };
  const creditsRemaining = credits.limit - credits.used;

  const getCreditsColor = () => {
    if (creditsRemaining > 10) return "text-green-500";
    if (creditsRemaining >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="glass-frost border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              AgentRank
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* Connected Store */}
            {profile?.shopify_shop_domain && (
              <div className="hidden sm:flex items-center gap-2 glass-panel px-4 py-2 rounded-full">
                <Store className="h-4 w-4 text-accent" />
                <span className="text-sm text-foreground font-medium">
                  {profile.shopify_shop_domain.replace('.myshopify.com', '')}
                </span>
              </div>
            )}

            {/* Credits Display */}
            <div className="relative group">
              <div className="glass-panel px-4 py-2 rounded-full cursor-pointer">
                <span className="text-sm text-muted-foreground">
                  Credits:{" "}
                  <span className={`font-bold ${getCreditsColor()}`}>
                    {creditsRemaining}/{credits.limit}
                  </span>
                  {" "}today
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block">
                <div className="glass-panel p-3 rounded-xl shadow-xl min-w-[200px]">
                  <p className="text-xs text-muted-foreground">
                    Monthly optimization limit
                  </p>
                  <p className="text-sm text-foreground font-medium mt-1">
                    {profile?.plan === 'free' ? 'Free plan' : 'Pro plan'}
                  </p>
                  {creditsRemaining < 3 && profile?.plan === 'free' && (
                    <Link
                      to="/onboarding/pricing"
                      className="text-xs text-accent hover:underline mt-2 block"
                    >
                      Upgrade for more →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
              >
                <User className="h-5 w-5 text-accent" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {profile?.plan || 'Free'} Plan
                    </p>
                  </div>
                  <Link
                    to="/dashboard/settings"
                    className="block px-3 py-2 text-sm text-foreground hover:bg-white/5 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-sm text-red-500 hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
