import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlassNav } from "@/components/GlassNav";
import { Footer } from "@/components/Footer";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Resources from "./pages/Resources";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardProducts from "./pages/dashboard/Products";
import Optimize from "./pages/dashboard/Optimize";
import Alerts from "./pages/dashboard/Alerts";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import Welcome from "./pages/onboarding/Welcome";
import ConnectStore from "./pages/onboarding/ConnectStore";
import OnboardingPricing from "./pages/onboarding/Pricing";
import Setup from "./pages/onboarding/Setup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with GlassNav + Footer */}
          <Route path="/" element={<><GlassNav /><Home /><Footer /></>} />
          <Route path="/features" element={<><GlassNav /><Features /><Footer /></>} />
          <Route path="/pricing" element={<><GlassNav /><Pricing /><Footer /></>} />
          <Route path="/resources" element={<><GlassNav /><Resources /><Footer /></>} />

          {/* Auth routes (no nav/footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Onboarding routes (no nav/footer) */}
          <Route path="/onboarding/welcome" element={<Welcome />} />
          <Route path="/onboarding/connect-store" element={<ConnectStore />} />
          <Route path="/onboarding/pricing" element={<OnboardingPricing />} />
          <Route path="/onboarding/setup" element={<Setup />} />

          {/* Dashboard routes (own layout) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/products" element={<DashboardProducts />} />
          <Route path="/dashboard/optimize" element={<Optimize />} />
          <Route path="/dashboard/alerts" element={<Alerts />} />
          <Route path="/dashboard/analytics" element={<Analytics />} />
          <Route path="/dashboard/settings" element={<Settings />} />

          {/* 404 */}
          <Route path="*" element={<><GlassNav /><NotFound /><Footer /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
