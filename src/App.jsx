import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ExcelSheet from "./pages/ExcelSheet";
import Projects from "./pages/Projects";
import { CompanyProvider } from "./context/CompanyContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <Router>
          <ProtectedRoute>
            <div className="flex min-h-screen bg-[#f5f6fb]">
              {" "}
              {/* ensure full viewport height */}
              <Sidebar />
              <main className="flex-1 min-h-screen overflow-auto">
                {" "}
                {/* main grows and scrolls */}
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-report" element={<CreateReport />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/excel" element={<ExcelSheet />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        </Router>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
