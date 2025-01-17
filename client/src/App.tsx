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
import { AirportsPage } from "./pages/admin/AirportsPage";
import { OceanCarriersPage } from "./pages/admin/OceanCarriersPage";
import { DocumentsPage } from "./pages/admin/DocumentsPage";
import { PortsPage } from "./pages/admin/PortsPage";
import { CountriesPage } from "./pages/admin/CountriesPage";
import { CustomersPage } from "./pages/admin/CustomersPage";
import { InternationalAgentsPage } from "./pages/admin/InternationalAgentsPage";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "./components/CookieConsent";
import { useUser } from "@/hooks/use-user";
import { TruckersPage } from "./pages/admin/TruckersPage";
import { CustomsBrokersPage } from "./pages/admin/CustomsBrokersPage";
import { PortTerminalsPage } from "./pages/admin/PortTerminalsPage";
import { WarehousesPage } from "./pages/admin/WarehousesPage";
import { AirfreightShipmentsPage } from "./pages/admin/AirfreightShipmentsPage";
import { InboundAirfreightShipmentsPage } from "./pages/admin/InboundAirfreightShipmentsPage";

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
                default:
                  return <Redirect to="/" />;
              }
            }}
          </Route>

          {/* Admin routes */}
          <Route path="/dashboard/admin">
            {() => <ProtectedRoute component={AdminDashboard} roles={['admin']} />}
          </Route>
          <Route path="/admin/airfreight">
            {() => <ProtectedRoute component={AirfreightShipmentsPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/airfreight/inbound">
            {() => <ProtectedRoute component={InboundAirfreightShipmentsPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/customers">
            {() => <ProtectedRoute component={CustomersPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/international-agents">
            {() => <ProtectedRoute component={InternationalAgentsPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/airlines">
            {() => <ProtectedRoute component={AirlinesPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/airports">
            {() => <ProtectedRoute component={AirportsPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/ocean-carriers">
            {() => <ProtectedRoute component={OceanCarriersPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/documents">
            {() => <ProtectedRoute component={DocumentsPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/ports">
            {() => <ProtectedRoute component={PortsPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/port-terminals">
            {() => <ProtectedRoute component={PortTerminalsPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/countries">
            {() => <ProtectedRoute component={CountriesPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/truckers">
            {() => <ProtectedRoute component={TruckersPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/customs-brokers">
            {() => <ProtectedRoute component={CustomsBrokersPage} roles={['admin']} />}
          </Route>
          <Route path="/admin/warehouses">
            {() => <ProtectedRoute component={WarehousesPage} roles={['admin']} />}
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