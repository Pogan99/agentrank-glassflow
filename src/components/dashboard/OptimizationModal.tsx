import { useState } from "react";
import { Product, SuggestedTag } from "@/types/product";
import { X, RefreshCw, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OptimizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (productId: string, selectedTags: string[]) => void;
  onRegenerate: (productId: string) => void;
}

export const OptimizationModal = ({
  product,
  isOpen,
  onClose,
  onApply,
  onRegenerate,
}: OptimizationModalProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);

  if (!product) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSelectAll = () => {
    setSelectedTags(product.suggestedTags.map((t) => t.tag));
  };

  const handleDeselectAll = () => {
    setSelectedTags([]);
  };

  const handleApply = async () => {
    setIsApplying(true);
    await onApply(product.id, selectedTags);
    setIsApplying(false);
    onClose();
  };

  const getSearchVolumeColor = (volume: string) => {
    switch (volume) {
      case "high":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-frost rounded-3xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 glass-frost border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-foreground">{product.currentTitle}</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Product Image */}
              <div className="aspect-video w-full max-w-md mx-auto rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.currentTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title Optimization */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Title Optimization</h3>
                <div className="glass-panel p-4 rounded-xl space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Before:</p>
                    <p className="text-sm text-foreground">{product.currentTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-accent mb-1">After:</p>
                    <p className="text-sm text-foreground font-medium">{product.optimizedTitle}</p>
                  </div>
                </div>
              </div>

              {/* Description Optimization */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Description Optimization</h3>
                <div className="glass-panel p-4 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    Enhanced with bullet points, keywords, and buyer intent phrases
                  </p>
                </div>
              </div>

              {/* Tag Optimization */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Tag Optimization</h3>

                {/* Current Tags */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current tags ({product.currentTags.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.currentTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Tags */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">
                      Suggested additions ({product.suggestedTags.length}):
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectAll}
                        className="text-xs text-accent hover:underline"
                      >
                        Select All
                      </button>
                      <button
                        onClick={handleDeselectAll}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {product.suggestedTags.map((suggestedTag, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-3 glass-panel p-3 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(suggestedTag.tag)}
                          onChange={() => handleToggleTag(suggestedTag.tag)}
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{suggestedTag.tag}</p>
                          <p className={`text-xs ${getSearchVolumeColor(suggestedTag.searchVolume)}`}>
                            {suggestedTag.searchVolume} volume
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Why These Changes */}
              <div className="glass-panel p-4 rounded-xl space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Why These Changes?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Title too short ({product.currentTitle.split(" ").length} words → SEO weakness)</li>
                  <li>• Missing buyer intent keywords ("perfect for table")</li>
                  <li>
                    • Only {product.currentTags.length}/13 allowed tags used (Etsy allows 13)
                  </li>
                  <li>• High-volume keywords added for better discoverability</li>
                </ul>
              </div>

              {/* ACP Readiness Score */}
              <div className="flex items-center justify-between glass-panel p-4 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Before:</p>
                  <p className={`text-3xl font-bold ${getScoreColor(product.acpReadinessBefore)}`}>
                    {product.acpReadinessBefore}/100
                  </p>
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">After:</p>
                  <p className={`text-3xl font-bold ${getScoreColor(product.acpReadinessAfter)}`}>
                    {product.acpReadinessAfter}/100
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="flex-1 py-3 px-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isApplying ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      Apply Optimization
                    </>
                  )}
                </button>
                <button
                  onClick={() => onRegenerate(product.id)}
                  className="px-6 py-3 glass-panel hover:bg-white/10 text-foreground font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Get Different Suggestions
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
