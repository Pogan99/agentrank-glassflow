import { Zap, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BulkActionBarProps {
  selectedCount: number;
  onOptimizeSelected: () => void;
  onGetNewSuggestions: () => void;
  onDeselectAll: () => void;
}

export const BulkActionBar = ({
  selectedCount,
  onOptimizeSelected,
  onGetNewSuggestions,
  onDeselectAll,
}: BulkActionBarProps) => {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sticky top-20 z-30 mb-6"
        >
          <div className="glass-frost rounded-2xl p-4 shadow-xl border border-white/10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: Count */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  {selectedCount} selected
                </span>
                <button
                  onClick={onDeselectAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Deselect all
                </button>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onGetNewSuggestions}
                  className="px-4 py-2 glass-panel hover:bg-white/10 text-foreground font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Get New Suggestions
                </button>
                <button
                  onClick={onOptimizeSelected}
                  className="px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                  <Zap className="h-4 w-4" />
                  Optimize Selected
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
