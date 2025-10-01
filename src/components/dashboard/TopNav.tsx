import { Link } from "react-router-dom";
import { Store, User } from "lucide-react";

export const TopNav = () => {
  const credits = { used: 18, limit: 20, resetsIn: "6h 23m" };
  const creditsRemaining = credits.limit - credits.used;

  const getCreditsColor = () => {
    if (creditsRemaining > 10) return "text-green-500";
    if (creditsRemaining >= 3) return "text-yellow-500";
    return "text-red-500";
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
            <div className="hidden sm:flex items-center gap-2 glass-panel px-4 py-2 rounded-full">
              <Store className="h-4 w-4 text-accent" />
              <span className="text-sm text-foreground font-medium">My Etsy Shop</span>
            </div>

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
                    Daily optimization limit
                  </p>
                  <p className="text-sm text-foreground font-medium mt-1">
                    Resets in {credits.resetsIn}
                  </p>
                  {creditsRemaining < 3 && (
                    <Link
                      to="/pricing"
                      className="text-xs text-accent hover:underline mt-2 block"
                    >
                      Upgrade for unlimited →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* User Menu */}
            <button className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors">
              <User className="h-5 w-5 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
