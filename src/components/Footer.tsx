import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <h3 className="text-xl font-bold bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              AgentRanked
            </h3>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              Terms & Conditions
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 AgentRanked. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
