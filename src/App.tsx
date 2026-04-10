import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import NoticesPage from "./pages/Notices.tsx";
import NoticeDetailPage from "./pages/NoticeDetail.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import StaffLogin from "./pages/StaffLogin.tsx";
import StaffTrips from "./pages/StaffTrips.tsx";
import TripControl from "./pages/TripControl.tsx";
import AdminTripMonitor from "./pages/AdminTripMonitor.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:id" element={<NoticeDetailPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/trips" element={<StaffTrips />} />
          <Route path="/staff/trip/:id" element={<TripControl />} />
          <Route path="/admin/trips" element={<AdminTripMonitor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
