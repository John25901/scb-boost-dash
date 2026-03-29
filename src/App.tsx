import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import Index from "./pages/Index";
import ExperienceClient from "./pages/ExperienceClient";
import PerformanceOps from "./pages/PerformanceOps";
import ModelesML from "./pages/ModelesML";
import BigData from "./pages/BigData";
import Rapports from "./pages/Rapports";
import Risques from "./pages/Risques";
import Parametres from "./pages/Parametres";
import PorteursCartes from "./pages/PorteursCartes";
import CycleVieCartes from "./pages/CycleVieCartes";
import AuditFacturation from "./pages/AuditFacturation";
import PerformanceTPE from "./pages/PerformanceTPE";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/porteurs-cartes" element={<PorteursCartes />} />
        <Route path="/cycle-vie-cartes" element={<CycleVieCartes />} />
        <Route path="/audit-facturation" element={<AuditFacturation />} />
        <Route path="/performance-tpe" element={<PerformanceTPE />} />
        <Route path="/experience-client" element={<ExperienceClient />} />
        <Route path="/performance-ops" element={<PerformanceOps />} />
        <Route path="/modeles-ml" element={<ModelesML />} />
        <Route path="/big-data" element={<BigData />} />
        <Route path="/rapports" element={<Rapports />} />
        <Route path="/risques" element={<Risques />} />
        <Route path="/parametres" element={<Parametres />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const LoginRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Login />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
