import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { HabitProvider, useHabits } from "./context/HabitContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Habits from "./pages/Habits";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";
import { SplashScreen } from "@/components/layout/SplashScreen";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

import { useDailyReminder } from "@/hooks/useDailyReminder";
import { ChatWidget } from "@/components/chat/ChatWidget";

const AppContent = () => {
  const { isLoading, isAppExiting, user, profile } = useHabits();
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  useDailyReminder();

  useEffect(() => {
    // Minimum splash screen duration
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  /* AUTH & ONBOARDING PROTECTION */
  useEffect(() => {
    if (!isLoading && user && profile) {
      // If user is logged in but hasn't completed onboarding -> Redirect to /onboarding
      if (!profile.onboarding_completed && location.pathname !== '/onboarding') {
        navigate('/onboarding');
      }
      // If user IS on /onboarding but HAS completed it -> Redirect to /dashboard
      else if (profile.onboarding_completed && location.pathname === '/onboarding') {
        navigate('/dashboard');
      }
    }
  }, [user, profile, isLoading, location.pathname, navigate]);

  if (showSplash || (isLoading && !isAppExiting)) {
    return <SplashScreen />;
  }

  return (
    <>
      {isAppExiting && <SplashScreen isExiting />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatWidget />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme" attribute="class">
      <HabitProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </HabitProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
