import { Switch, Route } from "wouter";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "./components/CookieConsent";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <CookieConsent />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />
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