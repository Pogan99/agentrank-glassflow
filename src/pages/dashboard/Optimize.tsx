import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Upload, RefreshCw, Sparkles } from "lucide-react";

const Optimize = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleOptimize = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsProcessing(false);
  };

  const features = [
    "AI-powered title optimization",
    "SEO-friendly descriptions",
    "13 high-volume tags suggested",
    "ACP readiness scoring",
    "Competitive analysis",
    "Instant preview before applying",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Optimize Single Product</h1>
          <p className="text-muted-foreground">
            Upload a product image or CSV to get AI-powered optimization suggestions
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Upload Area */}
          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-4">Upload Product</h2>

              {/* File Upload */}
              <label className="block">
                <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-accent/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">
                    {selectedFile ? selectedFile.name : "Drop your image or CSV here"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.csv"
                    onChange={handleFileChange}
                  />
                </div>
              </label>

              {/* Optimize Button */}
              <button
                onClick={handleOptimize}
                disabled={!selectedFile || isProcessing}
                className="w-full mt-6 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Optimize Product
                  </>
                )}
              </button>
            </div>

            {/* Info Card */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">What You Get</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Preview/Results */}
          <div className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Preview</h2>

            {!selectedFile && !isProcessing && (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload a product to see optimization suggestions
                  </p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="h-16 w-16 text-accent animate-spin mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">Analyzing your product...</p>
                  <p className="text-sm text-muted-foreground">
                    This usually takes 10-15 seconds
                  </p>
                </div>
              </div>
            )}

            {selectedFile && !isProcessing && (
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 glass-panel rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">File Name:</p>
                  <p className="text-foreground font-medium">{selectedFile.name}</p>
                </div>
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                  <p className="text-sm text-accent">
                    Ready to optimize! Click the button to generate AI suggestions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Tips */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-foreground mb-3">Pro Tips</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="text-accent font-semibold">Clear Images:</span> Use high-quality
              product photos for better AI analysis
            </div>
            <div>
              <span className="text-accent font-semibold">CSV Format:</span> Include columns:
              title, description, tags, price
            </div>
            <div>
              <span className="text-accent font-semibold">Batch Processing:</span> Use the
              Products page for optimizing multiple items
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Optimize;
