import { useState } from "react";
import { Product } from "@/types/product";
import { GlassCard } from "@/components/GlassCard";
import { ArrowRight, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({
  product,
  isSelected,
  onToggleSelect,
  onViewDetails,
}: ProductCardProps) => {
  const getStatusConfig = () => {
    switch (product.status) {
      case "ready":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bg: "bg-green-500/10",
          label: "Ready to optimize",
        };
      case "needs_fix":
        return {
          icon: AlertCircle,
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          label: "Needs attention",
        };
      case "optimized":
        return {
          icon: Clock,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          label: `Optimized ${getTimeAgo(product.lastOptimized)}`,
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-500/10",
          label: "Optimization failed",
        };
    }
  };

  const getTimeAgo = (timestamp?: string) => {
    if (!timestamp) return "";
    const now = new Date();
    const then = new Date(timestamp);
    const hours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const canSelect = product.status !== "optimized";
  const suggestedTagCount = product.suggestedTags.filter(t => !t.checked).length;

  return (
    <GlassCard className="p-0 relative overflow-hidden hover:shadow-xl transition-shadow">
      {/* Checkbox - Top-left overlay */}
      {canSelect && (
        <div className="absolute top-3 left-3 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(product.id)}
            className="w-5 h-5 rounded border-2 border-white/30 bg-background/50 backdrop-blur-sm checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent cursor-pointer"
          />
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-accent/10 to-transparent relative">
        <img
          src={product.image}
          alt={product.currentTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23333' width='400' height='400'/%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Before/After Titles */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Current:</p>
          <p className="text-sm text-foreground line-clamp-1">{product.currentTitle}</p>

          {product.status === "ready" && (
            <>
              <p className="text-xs text-accent mt-2">Optimized:</p>
              <p className="text-sm text-foreground font-medium line-clamp-2">
                {product.optimizedTitle}
              </p>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Tags:</span>
          <span className="text-foreground">
            ✓ {product.currentTags.length} existing
          </span>
          {suggestedTagCount > 0 && (
            <span className="text-accent font-medium">+ {suggestedTagCount} suggested</span>
          )}
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusConfig.bg}`}>
          <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
          <span className={`text-xs font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Validation Errors */}
        {product.validationErrors.length > 0 && (
          <div className="space-y-1">
            {product.validationErrors.map((error, i) => (
              <p key={i} className="text-xs text-red-500">
                • {error}
              </p>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(product)}
          className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-foreground transition-colors flex items-center justify-center gap-2 group"
        >
          {product.status === "ready" && "View Details"}
          {product.status === "needs_fix" && "Fix Now"}
          {product.status === "optimized" && "View Changes"}
          {product.status === "error" && "Retry"}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </GlassCard>
  );
};
