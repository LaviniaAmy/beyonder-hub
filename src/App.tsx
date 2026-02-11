import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import ExploreServices from "./pages/ExploreServices";
import ProviderDirectory from "./pages/ProviderDirectory";
import ProviderPage from "./pages/ProviderPage";
import EnquiryPage from "./pages/EnquiryPage";
import ParentDashboard from "./pages/ParentDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForProviders from "./pages/ForProviders";
import AdminPanel from "./pages/AdminPanel";
import AboutPage from "./pages/AboutPage";
import HelpCentre from "./pages/HelpCentre";
import GuidesPage from "./pages/GuidesPage";
import NewsPage from "./pages/NewsPage";
import CommunityPage from "./pages/CommunityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<ExploreServices />} />
            <Route path="/providers" element={<ProviderDirectory />} />
            <Route path="/provider/:id" element={<ProviderPage />} />
            <Route path="/enquiry/:id" element={<EnquiryPage />} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["parent"]}><ParentDashboard /></ProtectedRoute>} />
            <Route path="/provider-dashboard" element={<ProtectedRoute allowedRoles={["provider"]}><ProviderDashboard /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/for-providers" element={<ForProviders />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPanel /></ProtectedRoute>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpCentre />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
