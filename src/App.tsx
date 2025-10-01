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
import DashboardProducts from "./pages/dashboard/Products";

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

          {/* Dashboard routes (own layout) */}
          <Route path="/dashboard" element={<DashboardProducts />} />
          <Route path="/dashboard/products" element={<DashboardProducts />} />

          {/* 404 */}
          <Route path="*" element={<><GlassNav /><NotFound /><Footer /></>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
