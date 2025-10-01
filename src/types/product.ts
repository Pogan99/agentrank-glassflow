export interface SuggestedTag {
  tag: string;
  searchVolume: "high" | "medium" | "low";
  checked: boolean;
}

export interface Product {
  id: string;
  currentTitle: string;
  optimizedTitle: string;
  currentDescription: string;
  optimizedDescription: string;
  currentTags: string[];
  suggestedTags: SuggestedTag[];
  image: string;
  price: string;
  currency: string;
  quantity: number;
  acpReadinessBefore: number;
  acpReadinessAfter: number;
  status: "ready" | "needs_fix" | "optimized" | "error";
  lastOptimized?: string;
  validationErrors: string[];
}
