import { Switch, Route, Redirect } from "wouter";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { CustomerDashboard } from "./pages/dashboard/CustomerDashboard";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { AirlinesPage } from "./pages/admin/AirlinesPage";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "./components/CookieConsent";
import { useUser } from "@/hooks/use-user";

function App() {
  const { user, isLoading } = useUser();

  // Protected route wrapper
  const ProtectedRoute = ({ component: Component, roles }: { component: React.ComponentType, roles?: string[] }) => {
    if (isLoading) return null;

    if (!user) {
      return <Redirect to="/auth/login" />;
    }

    if (roles && !roles.includes(user.role?.name || '')) {
      return <Redirect to="/" />;
    }

    return <Component />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CookieConsent />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />

          {/* Protected routes */}
          <Route path="/dashboard">
            {() => {
              if (isLoading) return null;
              if (!user) return <Redirect to="/auth/login" />;

              // Redirect to role-specific dashboard
              switch (user.role?.name) {
                case 'admin':
                  return <Redirect to="/dashboard/admin" />;
                case 'customer':
                  return <Redirect to="/dashboard/customer" />;
                // Add other role dashboards here as they're implemented
                default:
                  return <Redirect to="/" />;
              }
            }}
          </Route>

          {/* Admin routes */}
          <Route path="/dashboard/admin">
            {() => <ProtectedRoute component={AdminDashboard} roles={['admin']} />}
          </Route>
          <Route path="/admin/airlines">
            {() => <ProtectedRoute component={AirlinesPage} roles={['admin']} />}
          </Route>

          {/* Customer routes */}
          <Route path="/dashboard/customer">
            {() => <ProtectedRoute component={CustomerDashboard} roles={['customer']} />}
          </Route>

          {/* 404 route */}
          <Route>
            <div className="flex items-center justify-center h-[50vh]">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          </Route>
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;