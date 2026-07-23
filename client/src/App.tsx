import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Pages
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import MembersPage from "@/pages/MembersPage";
import EventsPage from "@/pages/EventsPage";
import MinistriesPage from "@/pages/MinistriesPage";
import DonationsPage from "@/pages/DonationsPage";
import WelfarePage from "@/pages/WelfarePage";
import EvangelismPage from "@/pages/EvangelismPage";
import UsersPage from "@/pages/UsersPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/admin/auth");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pl-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Component />
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin login page */}
      <Route path="/admin/auth" component={AuthPage} />
      
      {/* Admin dashboard and management pages */}
      <Route path="/admin/app">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/admin/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/admin/members">
        <ProtectedRoute component={MembersPage} />
      </Route>
      <Route path="/admin/events">
        <ProtectedRoute component={EventsPage} />
      </Route>
      <Route path="/admin/ministries">
        <ProtectedRoute component={MinistriesPage} />
      </Route>
      <Route path="/admin/donations">
        <ProtectedRoute component={DonationsPage} />
      </Route>
      <Route path="/admin/analytics">
        <ProtectedRoute component={AnalyticsPage} />
      </Route>
      <Route path="/admin/welfare">
        <ProtectedRoute component={WelfarePage} />
      </Route>
      <Route path="/admin/evangelism">
        <ProtectedRoute component={EvangelismPage} />
      </Route>
      <Route path="/admin/notifications">
        <ProtectedRoute component={NotificationsPage} />
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute component={UsersPage} />
      </Route>

      {/* Redirect /admin to /admin/auth */}
      <Route path="/admin">
        <AuthPage />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
