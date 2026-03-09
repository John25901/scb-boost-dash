import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Index from "./pages/Index";
import ExperienceClient from "./pages/ExperienceClient";
import PerformanceOps from "./pages/PerformanceOps";
import ModelesML from "./pages/ModelesML";
import BigData from "./pages/BigData";
import Rapports from "./pages/Rapports";
import Risques from "./pages/Risques";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Index />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
