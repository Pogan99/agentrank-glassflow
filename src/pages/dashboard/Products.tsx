import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { OptimizationModal } from "@/components/dashboard/OptimizationModal";
import { BulkActionBar } from "@/components/dashboard/BulkActionBar";
import { BulkOptimizationModal } from "@/components/dashboard/BulkOptimizationModal";
import { Toast, ToastType } from "@/components/Toast";
import { Product } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";
import { APIClient } from "@/lib/api/client";

// Mock Data
const mockProducts: Product[] = [
  {
    id: "listing_12345",
    currentTitle: "Beige Vase",
    optimizedTitle: "Hand-Made Beige Vase Perfect for Table Centerpiece",
    currentDescription: "A nice vase",
    optimizedDescription: "Hand-crafted ceramic vase...",
    currentTags: ["vase", "beige", "ceramic"],
    suggestedTags: [
      { tag: "handmade", searchVolume: "high", checked: false },
      { tag: "table centerpiece", searchVolume: "medium", checked: false },
      { tag: "modern vase", searchVolume: "high", checked: false },
      { tag: "minimalist", searchVolume: "medium", checked: false },
      { tag: "neutral decor", searchVolume: "medium", checked: false },
      { tag: "boho vase", searchVolume: "low", checked: false },
      { tag: "pottery", searchVolume: "high", checked: false },
      { tag: "rustic", searchVolume: "medium", checked: false },
      { tag: "farmhouse", searchVolume: "high", checked: false },
      { tag: "home decor", searchVolume: "high", checked: false },
    ],
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400",
    price: "24.00",
    currency: "USD",
    quantity: 15,
    acpReadinessBefore: 42,
    acpReadinessAfter: 87,
    status: "ready",
    validationErrors: [],
  },
  {
    id: "listing_12346",
    currentTitle: "Blue Mug",
    optimizedTitle: "Handcrafted Blue Ceramic Coffee Mug - Perfect Morning Gift",
    currentDescription: "Blue mug for coffee",
    optimizedDescription: "Beautiful handcrafted ceramic mug...",
    currentTags: ["mug", "blue"],
    suggestedTags: [
      { tag: "coffee mug", searchVolume: "high", checked: false },
      { tag: "handcrafted", searchVolume: "high", checked: false },
      { tag: "ceramic mug", searchVolume: "high", checked: false },
      { tag: "gift", searchVolume: "high", checked: false },
      { tag: "morning coffee", searchVolume: "medium", checked: false },
    ],
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400",
    price: "18.00",
    currency: "USD",
    quantity: 25,
    acpReadinessBefore: 35,
    acpReadinessAfter: 82,
    status: "ready",
    validationErrors: [],
  },
  {
    id: "listing_12347",
    currentTitle: "Wooden Bowl",
    optimizedTitle: "Handmade Wooden Salad Bowl - Rustic Kitchen Decor",
    currentDescription: "",
    optimizedDescription: "",
    currentTags: ["bowl"],
    suggestedTags: [],
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400",
    price: "32.00",
    currency: "USD",
    quantity: 0,
    acpReadinessBefore: 25,
    acpReadinessAfter: 75,
    status: "needs_fix",
    validationErrors: ["Missing required field: availability", "Description too short"],
  },
];

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "needs_fix">("all");
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (!user) return;

    APIClient.getProducts(user.id)
      .then((data) => {
        // Transform database products to match Product interface
        const transformedProducts: Product[] = data.map(p => ({
          id: p.id,
          currentTitle: p.title,
          optimizedTitle: p.title, // TODO: Get from optimizations
          currentDescription: p.description || "",
          optimizedDescription: "", // TODO: Get from optimizations
          currentTags: p.tags || [],
          suggestedTags: [], // TODO: Get from optimizations
          image: p.featured_image || "",
          price: p.price?.toString() || "0",
          currency: p.currency || "USD",
          quantity: p.inventory_quantity || 0,
          acpReadinessBefore: Math.max(0, (p.acp_score || 0) - 20),
          acpReadinessAfter: p.acp_score || 0,
          status: p.acp_compliant ? "ready" : "needs_fix",
          validationErrors: p.missing_fields || [],
        }));
        setProducts(transformedProducts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleToggleSelect = (id: string) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowOptimizationModal(true);
  };

  const handleApplyOptimization = async (productId: string, selectedTags: string[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setToast({ message: "✓ Product optimized! ACP feed updated.", type: "success" });
  };

  const handleRegenerate = async (productId: string) => {
    setToast({ message: "Generating new suggestions...", type: "success" });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleOptimizeSelected = () => {
    if (selectedProducts.size === 0) return;
    setShowBulkModal(true);
  };

  const handleConfirmBulkOptimization = async () => {
    setShowBulkModal(false);
    setToast({
      message: `Pushing changes to Etsy... 0/${selectedProducts.size} complete`,
      type: "success",
    });

    // Simulate progress
    for (let i = 1; i <= selectedProducts.size; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setToast({
        message: `Pushing changes to Etsy... ${i}/${selectedProducts.size} complete`,
        type: "success",
      });
    }

    setToast({
      message: `✓ ${selectedProducts.size} products optimized! ACP feed updated.`,
      type: "success",
    });
    setSelectedProducts(new Set());
  };

  const handleGetNewSuggestions = () => {
    setToast({ message: "Generating new suggestions for selected products...", type: "success" });
  };

  const handleDeselectAll = () => {
    setSelectedProducts(new Set());
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.currentTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "ready" && product.status === "ready") ||
      (filter === "needs_fix" && product.status === "needs_fix");

    return matchesSearch && matchesFilter;
  });

  const selectedProductsData = products.filter((p) => selectedProducts.has(p.id));
  const bulkChanges = {
    titlesUpdated: selectedProductsData.length,
    descriptionsEnhanced: selectedProductsData.filter((p) => p.optimizedDescription).length,
    tagsAdded: selectedProductsData.reduce((sum, p) => sum + p.suggestedTags.length, 0),
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">
            Manage and optimize your Etsy product listings for AI discoverability
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-panel rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "ready", "needs_fix"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === f
                    ? "bg-accent text-accent-foreground"
                    : "glass-panel text-muted-foreground hover:bg-white/10"
                }`}
              >
                {f === "all" && "All"}
                {f === "ready" && "Ready"}
                {f === "needs_fix" && "Needs Fix"}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Bar */}
        <BulkActionBar
          selectedCount={selectedProducts.size}
          onOptimizeSelected={handleOptimizeSelected}
          onGetNewSuggestions={handleGetNewSuggestions}
          onDeselectAll={handleDeselectAll}
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProducts.has(product.id)}
              onToggleSelect={handleToggleSelect}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <OptimizationModal
        product={selectedProduct}
        isOpen={showOptimizationModal}
        onClose={() => setShowOptimizationModal(false)}
        onApply={handleApplyOptimization}
        onRegenerate={handleRegenerate}
      />

      <BulkOptimizationModal
        isOpen={showBulkModal}
        productCount={selectedProducts.size}
        creditsUsed={selectedProducts.size}
        creditsRemaining={2} // From TopNav credits
        changes={bulkChanges}
        onConfirm={handleConfirmBulkOptimization}
        onCancel={() => setShowBulkModal(false)}
      />

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

export default Products;
