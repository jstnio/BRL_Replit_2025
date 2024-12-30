import { Switch, Route } from "wouter";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Wrapper component for page transitions
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Switch key={location}>
            <Route path="/">
              <PageWrapper>
                <Home />
              </PageWrapper>
            </Route>
            <Route path="/services">
              <PageWrapper>
                <Services />
              </PageWrapper>
            </Route>
            <Route path="/about">
              <PageWrapper>
                <About />
              </PageWrapper>
            </Route>
            <Route path="/contact">
              <PageWrapper>
                <Contact />
              </PageWrapper>
            </Route>
            <Route>
              <PageWrapper>
                <div className="flex items-center justify-center h-[50vh]">
                  <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                </div>
              </PageWrapper>
            </Route>
          </Switch>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;