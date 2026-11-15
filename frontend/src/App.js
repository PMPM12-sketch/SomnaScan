import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/components/Dashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
