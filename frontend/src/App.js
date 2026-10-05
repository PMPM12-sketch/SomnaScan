import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/components/Dashboard";

function App() {
  return (
    <div className="App">
      <Dashboard />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
