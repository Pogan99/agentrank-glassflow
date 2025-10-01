import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BulkOptimizationModalProps {
  isOpen: boolean;
  productCount: number;
  creditsUsed: number;
  creditsRemaining: number;
  changes: {
    titlesUpdated: number;
    descriptionsEnhanced: number;
    tagsAdded: number;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export const BulkOptimizationModal = ({
  isOpen,
  productCount,
  creditsUsed,
  creditsRemaining,
  changes,
  onConfirm,
  onCancel,
}: BulkOptimizationModalProps) => {
  const willExceedLimit = creditsUsed > creditsRemaining;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass-frost rounded-3xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Optimize {productCount} Products?
              </h2>
              <button
                onClick={onCancel}
                className="w-10 h-10 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Credits Warning */}
              {willExceedLimit ? (
                <div className="glass-panel p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-500 mb-1">
                        Not enough credits
                      </p>
                      <p className="text-xs text-red-400">
                        You need {creditsUsed} credits but only have {creditsRemaining} remaining today.
                        Please upgrade or wait for your daily limit to reset.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This will use <span className="font-semibold text-accent">{creditsUsed}</span> of your{" "}
                  <span className="font-semibold text-foreground">{creditsRemaining}</span> remaining
                  daily optimizations.
                </p>
              )}

              {/* Changes Summary */}
              <div className="glass-panel p-4 rounded-xl space-y-2">
                <p className="text-sm font-semibold text-foreground mb-3">
                  Changes to be applied:
                </p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• {changes.titlesUpdated} titles updated</p>
                  <p>• {changes.descriptionsEnhanced} descriptions enhanced</p>
                  <p>• {changes.tagsAdded} new tags added across products</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 px-6 glass-panel hover:bg-white/10 text-foreground font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={willExceedLimit}
                  className="flex-1 py-3 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm & Push to Etsy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
