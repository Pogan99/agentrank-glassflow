import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlassNav } from "@/components/GlassNav";
import { Footer } from "@/components/Footer";
import { AuthProvider, ProtectedRoute } from "@/contexts/AuthContext";
import Waitlist from "./pages/Waitlist";
import PrivacyPolicy from "./pages/PrivacyPolicy";
// Temporarily deactivated imports
// import Home from "./pages/Home";
// import Features from "./pages/Features";
// import Pricing from "./pages/Pricing";
// import Resources from "./pages/Resources";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import ForgotPassword from "./pages/ForgotPassword";
// import NotFound from "./pages/NotFound";
// import Dashboard from "./pages/dashboard/Dashboard";
// import DashboardProducts from "./pages/dashboard/Products";
// import Optimize from "./pages/dashboard/Optimize";
// import Alerts from "./pages/dashboard/Alerts";
// import Analytics from "./pages/dashboard/Analytics";
// import Settings from "./pages/dashboard/Settings";
// import Welcome from "./pages/onboarding/Welcome";
// import ConnectStore from "./pages/onboarding/ConnectStore";
// import ShopifyCallback from "./pages/onboarding/ShopifyCallback";
// import OnboardingPricing from "./pages/onboarding/Pricing";
// import Setup from "./pages/onboarding/Setup";
// import Verify from "./pages/auth/Verify";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          {/* Active: Waitlist only */}
          <Route path="/" element={<><GlassNav /><Waitlist /><Footer /></>} />
          <Route path="/waitlist" element={<><GlassNav /><Waitlist /><Footer /></>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Temporarily deactivated routes */}
          {/* <Route path="/features" element={<><GlassNav /><Features /><Footer /></>} />
          <Route path="/pricing" element={<><GlassNav /><Pricing /><Footer /></>} />
          <Route path="/resources" element={<><GlassNav /><Resources /><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/verify" element={<Verify />} />
          <Route path="/onboarding/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/onboarding/connect-store" element={<ProtectedRoute><ConnectStore /></ProtectedRoute>} />
          <Route path="/onboarding/shopify/callback" element={<ProtectedRoute><ShopifyCallback /></ProtectedRoute>} />
          <Route path="/onboarding/pricing" element={<ProtectedRoute><OnboardingPricing /></ProtectedRoute>} />
          <Route path="/onboarding/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/products" element={<ProtectedRoute><DashboardProducts /></ProtectedRoute>} />
          <Route path="/dashboard/optimize" element={<ProtectedRoute><Optimize /></ProtectedRoute>} />
          <Route path="/dashboard/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> */}

          {/* 404 */}
          <Route path="*" element={<><GlassNav /><Waitlist /><Footer /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
